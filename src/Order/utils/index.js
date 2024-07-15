const { name } = require("ejs");


const { Order, OrderItems, PriceHistory, ProductT, ProductO, OrderItemsCombo, Topons, Variant, ComboVariants, Product, Balance, User, Option, SKU, Location, ComboItems } = require("../..");
const { getVariantSKU } = require("../../Variant/utils");
const { where } = require("sequelize");
const { updateSKU } = require("../../SKU/utils");




const getOrderTotalPrice = async (orderJson) => {
  let totalPrice = 0;
  for (const item of orderJson.orderItems) {
    console.log(orderJson.locationId);
    // const sku = await getVariantSKU(item.variantId, orderJson.locationId);
    // console.log(JSON.stringify(sku));

    if (item.type === 'single') {
      const v = await Variant.findByPk(item.variantId);
      const variantPrice = await v.getPrice(new Date());
      let itemTotalPrice = variantPrice * item.quantity;

      for (const topon of item.topons) {
        const t = await Topons.findByPk(topon.toponId);
        const toponPrice = await t.getPrice(new Date());
        itemTotalPrice += toponPrice * topon.quantity * item.quantity;
      }

      totalPrice += itemTotalPrice;
    } else if (item.type === 'combo') {
      let comboTotalPrice = 0;


      const p = await Product.findByPk(item.productId);
      const productPrice = await p.getPrice(new Date());
      comboTotalPrice += productPrice;
      for (const comboVariant of item.comboVariants) {

        for (const topon of comboVariant.topons) {
          const t = await Topons.findByPk(topon.toponId);
          const toponPrice = await t.getPrice(new Date());
          comboTotalPrice += toponPrice * topon.quantity;
        }
      }

      totalPrice += comboTotalPrice * item.quantity;
    }


    // const totalPrice = totalPrice;
  }

  return totalPrice
}
const createOrderJson = async (orderJson, order, t) => {
  try {



    // for (const item of orderJson.orderItems) {
    //   const sku = await getVariantSKU(item.variantId, orderJson.locationId);
    //   if (orderJson.force === true) {
    //   } else {
    //   }
    // }


    console.log("khjgjkl,mgfhj")


    for (const item of orderJson.orderItems) {
      if (item.type === 'single') {
        const orderItem = await OrderItems.create({
          OrderId: order.id,
          VariantId: item.variantId,
          quantity: item.quantity
        }, { transaction: t });

        for (const option of item.options) {
          await ProductO.create({
            OrderItemId: orderItem.id,
            OptionId: option.optionId
          }, { transaction: t });
        }

        for (const topon of item.topons) {
          await ProductT.create({
            OrderItemId: orderItem.id,
            ToponId: topon.toponId,
            quantity: topon.quantity
          }, { transaction: t });
        }
      } else if (item.type === 'combo') {
        const comboVariants = [];
        for (const comboVariant of item.comboVariants) {
          const orderItemCombo = await OrderItems.create({
            OrderId: order.id,
            VariantId: comboVariant.variantId,
            quantity: item.quantity
          }, { transaction: t });

          comboVariants.push(orderItemCombo);

          for (const option of comboVariant.options) {
            await ProductO.create({
              OrderItemId: orderItemCombo.id,
              OptionId: option.optionId
            }, { transaction: t });
          }

          for (const topon of comboVariant.topons) {
            await ProductT.create({
              OrderItemId: orderItemCombo.id,
              ToponId: topon.toponId,
              quantity: topon.quantity
            }, { transaction: t });
          }
        }

        for (const comboVariant of comboVariants) {
          const cv = await ComboVariants.findOne({ where: { ProductId: item.productId, VariantId: comboVariant.VariantId } });;
          await OrderItemsCombo.create({
            OrderItemId: comboVariant.id,
            ComboVariantId: cv.id,
            OrderId: order.id
          }, { transaction: t });
        }
      }
    }

    return order;

    // return result;

  } catch (error) {
    console.error("Error while creating order:", error);
  }
};

const getOrderDetails = async (orderId) => {

  const orderDetails = await Order.findOne({
    where: { id: orderId },
    attributes: ['id', 'status', 'totalPrice', 'LocationId', 'UserId'],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        required: false
      },
      {
        model: OrderItems,
        attributes: ['id', 'quantity', 'OrderId', 'VariantId'],
        include: [
          {
            model: Variant,
            attributes: ['id', 'name', 'ProductId']
          },
          {
            model: Option,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Topons,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: OrderItemsCombo,
            attributes: ['id', 'ComboVariantId', 'OrderId', 'OrderItemId'],
            required: false,
            include: [
              {
                model: ComboVariants,
                attributes: ['id', 'ProductId', 'VariantId'],
                include: [
                  {
                    model: Product,
                    as: 'PCV',
                    attributes: ['name'],
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  return orderDetails;
}

const processOrder = async (order) => {

}

const AcceptOrder = async (orderId) => {
  try {
    await Order.update(
      { status: "done" },
      { where: { id: orderId } }
    );
    const order = await Order.findOne({ where: { id: orderId } });

    console.log(JSON.stringify(order));

    const variants = await OrderItems.findOne({
      where: { OrderId: orderId },
      attributes: ['id', 'quantity'],
      include: [
        {
          model: Variant,
          attributes: ['id'],
          include: [
            {
              model: Location,
              through: { attributes: [] },
              attributes: ['id'],
              where: {
                id: order.LocationId
              },
              include: [
                {
                  model: SKU,
                  attributes: ['id', 'stock']
                }
              ]
            }
          ]
        }
      ]
    });


    await updateSKU(variants)

    console.log(JSON.stringify(variants));

  } catch (error) {
    console.error("Error while updating order:", error);
  }
}


const orderAdjustments = async (adjustments, orderId) => {
  const { Adjustments } = adjustments

  const prevOrder = await getOrderDetails(orderId);

  console.log(JSON.stringify(prevOrder))
  const { status, LocationId, UserId, OrderItems: orderItems } = prevOrder
  const order = await Order.create({
    status,
    totalPrice: 0,
    LocationId,
    UserId
  })


  for (const item of orderItems) {
    if (item.OrderItemsCombos.length > 0) {
      for (ci of item.OrderItemsCombos) {

        const orderItem = await OrderItems.create({
          OrderId: order.id,
          VariantId: ci.VariantId,
          quantity: ci.quantity
        });


        for (const option of ci.Options) {
          console.log(option)
          await ProductO.create({
            OrderItemId: orderItem.id,
            OptionId: option.id
          });
        }

        for (const topon of ci.Topons) {
          await ProductT.create({
            OrderItemId: orderItem.id,
            ToponId: topon.id,
            quantity: topon.quantity
          });
        }

        await OrderItemsCombo.create({
          OrderItemId: orderItem.id,
          ComboVariantId: ci.ComboVariantId,
          OrderId: order.id
        });


      }
    }
    else {
      const orderItem = await OrderItems.create({
        OrderId: order.id,
        VariantId: item.VariantId,
        quantity: item.quantity
      });


      for (const option of item.Options) {
        await ProductO.create({
          OrderItemId: orderItem.id,
          OptionId: option.id
        });
      }

      for (const topon of item.Topons) {
        await ProductT.create({
          OrderItemId: orderItem.id,
          ToponId: topon.id,
          quantity: topon.quantity
        });
      }

    }
  }

  ///update total price 


  for (const adjustment of Adjustments) {
    console.log(adjustment)
    const item = await OrderItems.update({ quantity: adjustment.quantity }, {
      where: {
        OrderId: orderId,
        VariantId: adjustment.itemId
      }
    })

  }

  return order


}

module.exports = { createOrderJson, getOrderDetails, getOrderTotalPrice, processOrder, AcceptOrder, orderAdjustments };
