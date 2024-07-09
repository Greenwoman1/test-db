const { name } = require("ejs");

const { Order, OrderItems, PriceHistory, ProductT, ProductO, OrderItemsCombo, Topons, Variant, ComboVariants } = require("../..");
const createOrderJson = async (orderJson) => {
  try {
    let totalPrice = 0;



    for (const item of orderJson.orderItems) {
      if (item.type === 'single') {
        const v = await Variant.findByPk(item.variantId);
        const variantPrice = await v.getPrice(new Date());
        let itemTotalPrice = variantPrice * item.quantity;

        for (const topon of item.topons) {
          const t = await Topons.findByPk(topon.toponId);
          console.log(topon.toponId)
          const toponPrice = await t.getPrice(new Date());
          itemTotalPrice += toponPrice * topon.quantity * item.quantity;
        }

        totalPrice += itemTotalPrice;
      } else if (item.type === 'combo') {
        let comboTotalPrice = 0;

        for (const comboVariant of item.comboVariants) {
          const v = await Variant.findByPk(comboVariant.variantId);
          const variantPrice = await v.getPrice(new Date());
          comboTotalPrice += variantPrice;

          for (const topon of comboVariant.topons) {
            const t = await Topons.findByPk(topon.toponId);
            const toponPrice = await t.getPrice(new Date());
            comboTotalPrice += toponPrice * topon.quantity;
          }
        }


        totalPrice += comboTotalPrice * item.quantity;
      }
    }

    const order = await Order.create({
      UserId: orderJson.userId,
      LocationId: orderJson.locationId,
      status: orderJson.status,
      totalPrice: totalPrice
    });

    for (const item of orderJson.orderItems) {
      if (item.type === 'single') {
        const orderItem = await OrderItems.create({
          OrderId: order.id,
          VariantId: item.variantId,
          quantity: item.quantity
        });

        for (const option of item.options) {
          await ProductO.create({
            OrderItemId: orderItem.id,
            OptionId: option.optionId
          });
        }

        for (const topon of item.topons) {
          await ProductT.create({
            OrderItemId: orderItem.id,
            ToponId: topon.toponId,
            quantity: topon.quantity
          });
        }
      } else if (item.type === 'combo') {
        const comboVariants = [];
        for (const comboVariant of item.comboVariants) {
          const orderItemCombo = await OrderItems.create({
            OrderId: order.id,
            VariantId: comboVariant.variantId,
            quantity: item.quantity
          });

          comboVariants.push(orderItemCombo);

          for (const option of comboVariant.options) {
            await ProductO.create({
              OrderItemId: orderItemCombo.id,
              OptionId: option.optionId
            });
          }

          for (const topon of comboVariant.topons) {
            await ProductT.create({
              OrderItemId: orderItemCombo.id,
              ToponId: topon.toponId,
              quantity: topon.quantity
            });
          }
        }

        for (const comboVariant of comboVariants) {
          const cv = await ComboVariants.findOne({ where: { ProductId: item.productId, VariantId: comboVariant.VariantId } });;
          await OrderItemsCombo.create({
            OrderItemId: comboVariant.id,
            ComboVariantId: cv.id,
            OrderId: order.id
          });
        }
      }
    }

    return order;

  } catch (error) {
    console.error("Error while creating order:", error);
  }
};




module.exports = { createOrderJson };
