const { name } = require("ejs");


const { Order, OrderItems, PriceHistory, ProductT, ProductO, OrderItemsCombo, Topons, Variant, ComboVariants, Product, Balance, User, Option, SKU, Location, ComboItems, VariantLocations, OrderItemOptions, OrderItemTopons, ToponLocations, VariantSKURule, VariantIngredients, IngredientSKURule, ToponSKURule, GroupToponsMid, LinkedVariants, OrderItemIngredients } = require("../..");
const { getVariantSKU } = require("../../Variant/utils");
const { setBalance } = require("../../Balance/utils");




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
const createOrderJson = async (order) => {

  try {
    const o = await Order.create({ UserId: order.userId, LocationId: order.locationId, status: 'pending', totalPrice: 13.5 });

    const promises = [];

    for (const item of order.items) {
      const OI = await OrderItems.create({ OrderId: o.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity });

      const pType = await Product.findOne({ where: { id: item.productId }, attributes: ['type'] });

      console.log(pType.type)
      switch (pType.type) {
        case 'single':
          const singleIngredientPromise = VariantLocations.findOne({
            where: { id: item.vlId },
            attributes: ['id'],
            include: [
              {
                model: VariantIngredients,
                as: 'VL_VI',
                required: false,
                attributes: ['id'],
              }
            ]
          }).then(ingredients => {
            const ingredientPromises = ingredients.VL_VI.map(ingredient =>
              OrderItemIngredients.create({ OrderItemId: OI.id, VariantIngredientId: ingredient.id })
            );
            return Promise.all(ingredientPromises);
          });
          promises.push(singleIngredientPromise);
          break;

        case 'combo':
          const comboIngredientPromise = VariantLocations.findOne({
            where: { id: item.vlId },
            attributes: ['id'],
            include: [
              {
                model: Variant,
                as: 'VL',
                attributes: ['id'],
                include: [{
                  model: LinkedVariants,
                  as: 'LinkVar',
                  required: false,
                  attributes: ['id'],
                  include: [{
                    model: VariantLocations,

                    attributes: ['id'],
                    include: [
                      {
                        as: 'VL_VI',
                        required: false,
                        attributes: ['id'],
                        model: VariantIngredients
                      }]
                  }]
                }],
              }
            ]
          }).then(variantLocationsInOrderItem => {
            const promises = variantLocationsInOrderItem.VL.LinkVar.map(vl => {
              const ingredientPromises = vl.VariantLocation.VL_VI.map(ingredient =>
                OrderItemIngredients.create({ OrderItemId: OI.id, VariantIngredientId: ingredient.id })
              );
              return Promise.all(ingredientPromises);
            });
            return Promise.all(promises);
          });
          promises.push(comboIngredientPromise);

          // Add promises for options and topons
          item.options.forEach(option => {
            const optionPromise = OrderItemOptions.create({ OrderItemId: OI.id, OptionId: option });
            promises.push(optionPromise);
          });

          item.topons.forEach(topon => {
            const toponPromise = OrderItemTopons.create({ OrderItemId: OI.id, GroupToponsMidId: topon.id, quantity: topon.quantity });
            promises.push(toponPromise);
          });

          break;
      }
    }

    await Promise.all(promises);


    return o;
  } catch (error) {
    console.log(error);
  }
};




// Example usage:
const order = {
  userId: 1,
  locationId: 2,
  items: [
    {
      vlId: 1,
      productId: 1,
      quantity: 2,
      options: [1, 2],
      topons: [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 1 }
      ]
    }
  ]
};



const getOrderDetails = async (orderId) => {

  const orderDetails = await Order.findOne({
    logging: console.log,
    where: { id: orderId },
    attributes: ['id', 'status', 'totalPrice', 'LocationId', 'UserId'],
    include: [
      {
        model: User,
        attributes: ['id'],
        required: false
      },
      {
        model: OrderItems,
        attributes: ['id', 'quantity', 'ProductId'],
        include: [
          {
            model: VariantLocations,
            attributes: ['id']
          },
          {
            model: OrderItemOptions,
            attributes: ['id'],
            include: [
              {
                model: Option,
                attributes: ['id']
              }
            ]
          },
          {
            model: OrderItemTopons,
            attributes: ['id', 'quantity'],
            include: [
              {
                model: GroupToponsMid,
                attributes: ['id'],
                include: [
                  {
                    model: ToponLocations,

                    attributes: ['id']
                  }
                ]
              }
            ]

          },
          {
            model: OrderItemIngredients,
            attributes: ['id'],
            required: false,
            include: [
              {
                model: VariantIngredients,
                attributes: ['id']
              }
            ]
          }


        ]
      }
    ]
  });


  const transformedOrder = {
    userId: orderDetails.UserId,
    locationId: orderDetails.LocationId,
    orderItems: orderDetails.OrderItems?.map(orderItem => ({
      productId: orderItem.ProductId,
      vlId: orderItem.VariantLocation.id,
      quantity: orderItem.quantity,
      options: orderItem.OrderItemOptions?.map(option => option.Option.id),
      topons: orderItem.OrderItemTopons?.map(topon => ({
        toponId: topon.GroupToponsMid.id,
        quantity: topon.quantity
      })),
      ingredients: orderItem.OrderItemIngredients?.map(topon => ({
        ingredientId: topon.VariantIngredient.id,

      }))
    }))
  };


  return transformedOrder;

}





const orderAdjustments = async (adjustments, orderId, t) => {
  const { Adjustments } = adjustments

  const prevOrder = await getOrderDetails(orderId);

  const { status, LocationId, UserId, OrderItems: orderItems } = prevOrder
  const order = await Order.create({
    status,
    totalPrice: 0,
    LocationId,
    UserId
  }, { transaction: t });

  ///duplicate order 
  for (const item of orderItems) {
    if (item.OrderItemsCombos.length > 0) {
      for (ci of item.OrderItemsCombos) {

        const orderItem = await OrderItems.create({
          OrderId: order.id,
          VariantId: ci.VariantId,
          quantity: ci.quantity
        }, { transaction: t });


        for (const option of ci.Options) {
          console.log(option)
          await ProductO.create({
            OrderItemId: orderItem.id,
            OptionId: option.id
          }, { transaction: t });
        }

        for (const topon of ci.Topons) {
          await ProductT.create({
            OrderItemId: orderItem.id,
            ToponId: topon.id,
            quantity: topon.quantity
          }, { transaction: t });
        }

        await OrderItemsCombo.create({
          OrderItemId: orderItem.id,
          ComboVariantId: ci.ComboVariantId,
          OrderId: order.id
        }, { transaction: t });


      }
    }
    else {
      const orderItem = await OrderItems.create({
        OrderId: order.id,
        VariantId: item.VariantId,
        quantity: item.quantity
      }, { transaction: t });


      for (const option of item.Options) {
        await ProductO.create({
          OrderItemId: orderItem.id,
          OptionId: option.id
        }, { transaction: t });
      }

      for (const topon of item.Topons) {
        await ProductT.create({
          OrderItemId: orderItem.id,
          ToponId: topon.id,
          quantity: topon.quantity
        }, { transaction: t });
      }

    }
  }



  ///aplicate adjustments

  for (const adjustment of Adjustments) {
    console.log(adjustment)
    const item = await OrderItems.update({ quantity: adjustment.quantity }, {
      where: {
        OrderId: orderId,
        VariantId: adjustment.itemId
      }
    }, { transaction: t });

  }

  const data = await OrderItems.findAll({
    where: { OrderId: orderId },
    attributes: ['id', 'quantity'],
    include: [
      {
        model: Variant,
        attributes: ['id'],
        include: [
          {
            model: PriceHistory,
            attributes: ['price'],
            where: {
              itemType: 'Variant'
            },
            required: false
          }
        ]
      },
      {
        model: Topons,
        attributes: ['id'],
        through: { attributes: ['quantity'] },
        include: [
          {
            model: PriceHistory,
            where: {
              itemType: 'topon'
            },
            attributes: ['price'],
            required: false
          }
        ]
      }
    ]
  });

  const mappedData = data.map(orderItem => {
    const variantPrice = parseFloat(orderItem.Variant.Prices[0].price);

    const topons = orderItem.Topons.map(topon => {
      const toponPrice = parseFloat(topon.Prices[0].price);
      return {
        id: topon.id,
        quantity: topon.ProductT.quantity,
        price: toponPrice
      };
    });
    console.log(orderItem.Variant.id)
    return {
      id: orderItem.Variant.id,
      quantity: orderItem.quantity,
      price: variantPrice,
      topons: topons
    };
  });
}


const calculateTotalPrice = async (data) => {
  return data.reduce((total, item) => {
    const toponsTotal = item.topons.reduce((subTotal, topon) => {
      return subTotal + (topon.price * topon.quantity);
    }, 0);

    const itemTotal = (item.price + toponsTotal) * item.quantity;
    return total + itemTotal;
  }, 0);
};






const updateSKU = async (items) => {

  const rulesSKUSingle = (id) => {
    return new Promise((resolve, reject) => {

      VariantLocations.findOne({
        where: { id: id },
        attributes: ['id'],
        include: [
          {
            model: VariantSKURule,
            as: 'VL_Rule',
            required: false,
            attributes: ['id', 'quantity', 'SKUId', 'unit']
          },
          {
            model: VariantIngredients,
            as: 'VL_VI',
            required: false,
            attributes: ['id'],
            include: [
              {
                model: IngredientSKURule,
                as: 'VI_Rule',
                required: false,
                attributes: ['id', 'quantity', 'SKUId', 'unit']
              }
            ]
          }
        ]
      }).then(rules => resolve(rules))


    })
  }
  const rulesSKUCombo = (id) => {
    return new Promise((resolve, reject) => {

      VariantLocations.findOne({
        where: { id: id },
        attributes: ['id'],
        include: [
          {
            model: Variant,
            required: false,
            as: 'VL',
            attributes: ['id'],
            include: [
              {
                model: LinkedVariants,
                as: 'LinkVar',
                attributes: ['id'],
                include: [
                  {
                    model: VariantLocations,
                    attributes: ['id'],
                    include: [
                      {
                        model: VariantSKURule,
                        as: 'VL_Rule',
                        required: false,
                        attributes: ['id', 'quantity', 'SKUId', 'unit']
                      },
                      {
                        model: VariantIngredients,
                        as: 'VL_VI',

                        required: false,
                        attributes: ['id'],
                        include: [
                          {
                            as:   'VI_Rule',  
                            model: IngredientSKURule,
                            attributes: ['id', 'quantity', 'SKUId', 'unit']
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }).then(rules => resolve(rules))

    })
  }


  const rulesSKUTopon = (id) => {
    return new Promise((resolve, reject) => {
      GroupToponsMid.findOne({
        where: { id: id },
        attributes: ['id'],
        include: [
          {
            model: ToponSKURule,
            as: 'GT_Rule',
            required: false,
            attributes: ['id', 'quantity', 'SKUId', 'unit']
          }
        ]
      }).then(rules => resolve(rules))

    })

  }



  const promises = []

  for (const item of items) {
    const pType = await Product.findOne({ where: { id: item.productId }, attributes: ['type'] })
    
    switch (pType.type) {
      case 'single':
        const singleIngredientPromise = rulesSKUSingle(item.vlId).then(rules => {
          item.data = rules
          return rules
        })

        promises.push(singleIngredientPromise)

        break;

      case 'combo':

        const comboIngredientPromise = rulesSKUCombo(item.vlId).then(rules => {
          item.data = rules
          return rules
        })

        promises.push(comboIngredientPromise)

        break;

    }

    for (const topon of item.topons) {
      const temp = rulesSKUTopon(topon.toponId).then(rules => {
        topon.data = rules
        return rules
      })

      promises.push(temp)
    }



    const skuInfo = {}

    




  }
  await Promise.all(promises)

console.log((JSON.stringify(items, null, 2)))
}


module.exports = { createOrderJson, getOrderDetails, getOrderTotalPrice, orderAdjustments, updateSKU };
