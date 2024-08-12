const { name } = require("ejs");


const { Order, OrderItem, PriceHistory, ProductT, ProductO, OrderItemCombo, Topon, Variant, ComboVariants, Product, Balance, User, Option, SKU, Location, ComboItems, VariantLocation, OrderItemOption, OrderItemTopons, ToponLocation, VariantSKURule, VariantIngredient, IngredientSKURule, ToponSKURule, GroupToponsMid, LinkedVariant, OrderItemIngredient } = require("../..");
const { getVariantSKU } = require("../../Variant/utils");
const { setBalance } = require("../../Balance/utils");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");




const getOrderTotalPrice = async (orderJson) => {
  let totalPrice = 0;
  for (const item of orderJson.OrderItem) {

    if (item.type === 'single') {
      const v = await Variant.findByPk(item.variantId);
      const variantPrice = await v.getPrice(new Date());
      let itemTotalPrice = variantPrice * item.quantity;

      for (const topon of item.topons) {
        const t = await Topon.findByPk(topon.toponId);
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
          const t = await Topon.findByPk(topon.toponId);
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
      const OI = await OrderItem.create({ OrderId: o.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity });

      const pType = await Product.findOne({ where: { id: item.productId }, attributes: ['type'] });

      switch (pType.type) {
        case 'single':
          const singleIngredientPromise = VariantLocation.findOne({
            where: { id: item.vlId },
            attributes: ['id'],
            include: [
              {
                model: VariantIngredient,
                as: 'VarLocIng',
                required: false,
                attributes: ['id'],
              }
            ]
          }).then(Ingredient => {
            const ingredientPromises = Ingredient.VarLocIng.map(ingredient =>
              OrderItemIngredient.create({ OrderItemId: OI.id, VariantIngredientId: ingredient.id })
            );
            return Promise.all(ingredientPromises);
          });
          promises.push(singleIngredientPromise);
          break;

        case 'combo':
          const comboIngredientPromise = VariantLocation.findOne({
            where: { id: item.vlId },
            attributes: ['id'],
            include: [
              {
                model: Variant,
                as: 'VarLoc',
                attributes: ['id'],
                include: [{
                  model: LinkedVariant,
                  as: 'LinkVar',
                  required: false,
                  attributes: ['id'],
                  include: [{
                    model: VariantLocation,
                    as: 'LinkVarLoc',
                    attributes: ['id'],
                    include: [
                      {
                        as: 'VarLocIng',
                        required: false,
                        attributes: ['id'],
                        model: VariantIngredient
                      }]
                  }]
                }],
              }
            ]
          }).then(variantLocationsInOrderItem => {
            const promises = variantLocationsInOrderItem.VarLoc.LinkVar.map(vl => {
              const ingredientPromises = vl.LinkVarLoc.VarLocIng.map(ingredient =>
                OrderItemIngredient.create({ OrderItemId: OI.id, VariantIngredientId: ingredient.id })
              );
              return Promise.all(ingredientPromises);
            });
            return Promise.all(promises);
          });
          promises.push(comboIngredientPromise);

          // Add promises for options and topons
          item.options.forEach(option => {
            const optionPromise = OrderItemOption.create({ OrderItemId: OI.id, OptionId: option });
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
        model: OrderItem,
        attributes: ['id', 'quantity', 'ProductId'],
        include: [
          {
            model: VariantLocation,
            attributes: ['id']
          },
          {
            model: OrderItemOption,
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
                    model: ToponLocation,

                    attributes: ['id']
                  }
                ]
              }
            ]

          },
          {
            model: OrderItemIngredient,
            attributes: ['id'],
            required: false,
            include: [
              {
                model: VariantIngredient,
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
    OrderItems: orderDetails.OrderItems?.map(orderItem => ({
      productId: orderItem.ProductId,
      vlId: orderItem.VariantLocation.id,
      quantity: orderItem.quantity,
      options: orderItem.OrderItemOption?.map(option => option.Option.id),
      topons: orderItem.OrderItemTopons?.map(topon => ({
        toponId: topon.GroupToponsMid.id,
        quantity: topon.quantity
      })),
      Ingredient: orderItem.OrderItemIngredient?.map(topon => ({
        ingredientId: topon.VariantIngredient.id,

      }))
    }))
  };


  return transformedOrder;

}




const calculateTotalPrice = async (order) => {
  let totalPrice = 0;
  for (const item of order.items) {
    const v = await VariantLocation.findByPk(item.vlId);
    const variantPrice = await v.getPrice(new Date());
    totalPrice += v.VariantPrice.price * item.quantity;

    for (const topon of item.topons) {
      const t = await Topon.findByPk(topon.toponId);
      const toponPrice = await t.getPrice(new Date());
      totalPrice += toponPrice * topon.quantity * item.quantity;
    }
  }
  return totalPrice
}


const updateSKU = async (items) => {

  const rulesSKUSingle = (id) => {
    return new Promise((resolve, reject) => {

      VariantLocation.findOne({
        where: { id: id },
        attributes: ['id'],
        include: [
          {
            model: VariantSKURule,
            as: 'VarLocRule',
            required: false,
            attributes: ['id', 'quantity', 'SKUId', 'unit']
          },
          {
            model: VariantIngredient,
            as: 'VarLocIng',
            required: false,
            attributes: ['id'],
            include: [
              {
                model: IngredientSKURule,
                as: 'VarIngRule',
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

      VariantLocation.findOne({
        where: { id: id },
        attributes: ['id'],
        include: [
          {
            model: Variant,
            required: false,
            as: 'VarLoc',
            attributes: ['id'],
            include: [
              {
                model: LinkedVariant,
                as: 'LinkVar',
                attributes: ['id', 'quantity'],
                include: [
                  {
                    model: VariantLocation,
                    as: 'LinkVarLoc',
                    attributes: ['id'],
                    include: [
                      {
                        model: VariantSKURule,
                        as: 'VarLocRule',
                        required: false,
                        attributes: ['id', 'quantity', 'SKUId', 'unit']
                      },
                      {
                        model: VariantIngredient,
                        as: 'VarLocIng',

                        required: false,
                        attributes: ['id'],
                        include: [
                          {
                            as: 'VarIngRule',
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
            as: 'TSRule',
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




  }


  const skuInfo = {}
  const mapData = async (data) => {
    const result = [];

    data.forEach(product => {
      const productQuantity = product.quantity;


      if (product.topons) {
        product.topons.forEach(topon => {
          const toponQuantity = topon.quantity;

          const toponRuleQuantity = topon.data.TSRule.quantity;

          if (topon.data.TSRule) {
            result.push({
              SKUID: topon.data.TSRule.SKUId,
              quantity: toponQuantity * productQuantity * topon.data.TSRule.quantity
            });
          }
        });
      }

      if (product.data.VarLocRule) {
        result.push({
          SKUID: product.data.VarLocRule.SKUId,
          quantity: productQuantity * product.data.VarLocRule.quantity
        });
      } if (product.data.VarLocIng) {

        product.data.VarLocIng.forEach(vi => {
          if (vi.VarIngRule) {
            result.push({
              SKUID: vi.VarIngRule.SKUId,
              quantity: productQuantity * vi.VarIngRule.quantity
            });
          }
        });
      }

      if (product.data.VarLoc) {
        product.data.VarLoc.LinkVar.forEach(linkVar => {
          if (linkVar.LinkVarLoc.VarLocRule) {
            result.push({
              SKUID: linkVar.LinkVarLoc.VarLocRule.SKUId,

              quantity: productQuantity * linkVar.quantity * linkVar.LinkVarLoc.VarLocRule.quantity
            });
          } if (linkVar.LinkVarLoc.VarLocIng) {
            linkVar.LinkVarLoc.VarLocIng.forEach(vi => {
              if (vi.VarIngRule) {
                result.push({
                  SKUID: vi.VarIngRule.SKUId,
                  quantity: productQuantity * vi.VarIngRule.quantity * linkVar.quantity
                });
              }
            });
          }
        });
      }
    });

    return result;
  };




  await Promise.all(promises)


  const skuPromises = []

  const result = await mapData(items);
  for (const i of result) {
    const sku = await SKU.findOne({ where: { id: i.SKUID } })

    skuPromises.push(
      sku.update({ stock: sku.stock - i.quantity })
    )


  }

  await Promise.all(skuPromises)
  return items

}


module.exports = { createOrderJson, getOrderDetails, getOrderTotalPrice, updateSKU, calculateTotalPrice };
