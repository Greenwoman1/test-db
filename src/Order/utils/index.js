const { name } = require("ejs");


const { getVariantSKU } = require("../../Variant/utils");
const { setBalance } = require("../../Balance/utils");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");

const { Order, OrderItem, PriceHistory, ProductT, ProductO, OrderItemCombo, Topon, Variant, ComboVariants, Product, Balance, User, Option, SKU, Location, ComboItems, VariantLocation, OrderItemOption, OrderItemTopons, ToponLocation, VariantSKURule, VariantIngredient, IngredientSKURule, ToponSKURule, GroupToponsMid, LinkedVariant, OrderItemIngredient, VariantPrice, ToponPrice } = require("../..");


const getSingleItemTotalPrice = async (item) => {
  const v = await VariantLocation.findByPk(item.vlId);
  const variantPrice = await VariantPrice.getPriceByDate(v.VariantId);
  let itemTotalPrice = variantPrice * item.quantity;

  for (const topon of item.topons) {
    const t = await GroupToponsMid.findByPk(topon.toponId);
    const tl = await ToponLocation.findByPk(t.ToponLocationId);
    const toponPrice = await ToponPrice.getPriceByDate(tl.ToponId);
    itemTotalPrice += toponPrice * topon.quantity * item.quantity;
  }

  return itemTotalPrice;
};

// Calculate price for a combo item
const getComboItemTotalPrice = async (item) => {
  let comboTotalPrice = 0;
  const p = await Product.findByPk(item.productId);
  const productPrice = await VariantPrice.getPriceByDate(p.VariantId);
  comboTotalPrice += productPrice;

  for (const comboVariant of item.comboVariants) {
    for (const topon of comboVariant.topons) {
      const t = await GroupToponsMid.findByPk(topon.toponId);
      const tl = await ToponLocation.findByPk(t.ToponLocationId);
      const toponPrice = await ToponPrice.getPriceByDate(tl.ToponId);
      comboTotalPrice += toponPrice * topon.quantity;
    }
  }

  return comboTotalPrice * item.quantity;
};

// Calculate the total price of the order
const getOrderTotalPrice = async (orderJson) => {
  let totalPrice = 0;

  for (const item of orderJson.OrderItem) {
    if (item.type === 'single') {
      totalPrice += await getSingleItemTotalPrice(item);
    } else if (item.type === 'combo') {
      totalPrice += await getComboItemTotalPrice(item);
    }
  }

  return totalPrice;
};

// Create a single order item
const createOrderItem = async (item, order, transaction) => {
  const OI = await OrderItem.create({
    OrderId: order.id,
    VariantLocationId: item.vlId,
    ProductId: item.productId,
    quantity: item.quantity
  }, { transaction });

  if (item.type === 'single') {
    await getSingleIngredients(item.vlId, OI.id, transaction);
  } else if (item.type === 'combo') {
    await getComboIngredients(item.vlId, OI.id, transaction);
  }

  await getSingleOptions(item.options, OI.id, transaction);
  await getComboOptions(item.topons, OI.id, transaction);
};

// Create order JSON
const createOrderJson = async (order, transaction) => {
  try {
    const o = await Order.create({
      UserId: order.userId,
      LocationId: order.locationId,
      status: 'pending',
      totalPrice: order.totalPrice
    }, { transaction });

    const itemPromises = order.items.map(item => createOrderItem(item, o, transaction));
    await Promise.all(itemPromises);

    return o;
  } catch (error) {
    console.error('Error creating order JSON:', error.message);
    throw error;
  }
};

// Get single ingredients
const getSingleIngredients = async (vlId, orderItemId, transaction) => {
  const variantLocation = await VariantLocation.findOne({
    where: { id: vlId },
    include: [{ model: VariantIngredient, as: 'VarLocIng' }]
  }, { transaction });

  const ingredientPromises = variantLocation.VarLocIng.map(ingredient =>
    OrderItemIngredient.create({
      OrderItemId: orderItemId,
      VariantIngredientId: ingredient.id
    }, { transaction })
  );

  await Promise.all(ingredientPromises);
};

// Get combo ingredients
const getComboIngredients = async (vlId, orderItemId, transaction) => {
  const variantLocation = await VariantLocation.findOne({
    where: { id: vlId },
    include: [{
      model: Variant,
      as: 'VarLoc',
      include: [{
        model: LinkedVariant,
        as: 'LinkVar',
        include: [{
          model: VariantLocation,
          as: 'LinkVarLoc',
          include: [{
            model: VariantIngredient,
            as: 'VarLocIng'
          }]
        }]
      }]
    }]
  }, { transaction });

  const ingredientPromises = variantLocation.VarLoc.LinkVar.flatMap(linkVar =>
    linkVar.LinkVarLoc.VarLocIng.map(ingredient =>
      OrderItemIngredient.create({
        OrderItemId: orderItemId,
        VariantIngredientId: ingredient.id
      }, { transaction })
    )
  );

  await Promise.all(ingredientPromises);
};

// Get single options
const getSingleOptions = async (options, orderItemId, transaction) => {
  const optionPromises = options.map(option =>
    OrderItemOption.create({
      OrderItemId: orderItemId,
      OptionId: option
    }, { transaction })
  );

  await Promise.all(optionPromises);
};

// Get combo options
const getComboOptions = async (topons, orderItemId, transaction) => {
  const toponPromises = topons.map(topon =>
    OrderItemTopons.create({
      OrderItemId: orderItemId,
      GroupToponsMidId: topon.toponId,
      quantity: topon.quantity
    }, { transaction })
  );

  await Promise.all(toponPromises);
};

// Get order details
const getOrderDetails = async (orderId, transaction) => {
  const orderDetails = await Order.findOne({
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
          { model: VariantLocation, attributes: ['id'] },
          {
            model: OrderItemOption,
            attributes: ['id'],
            include: [{ model: Option, attributes: ['id'] }]
          },
          {
            model: OrderItemTopons,
            attributes: ['id', 'quantity'],
            include: [{ model: GroupToponsMid, attributes: ['id'], include: [{ model: ToponLocation, attributes: ['id'] }] }]
          },
          {
            model: OrderItemIngredient,
            attributes: ['id'],
            include: [{ model: VariantIngredient, attributes: ['id'] }]
          }
        ]
      }
    ]
  }, { transaction });

  console.log(JSON.stringify(orderDetails, null, 2));
  return transformOrderDetails(orderDetails);
};

// Transform order details for output
const transformOrderDetails = (orderDetails) => {
  return {
    userId: orderDetails.UserId,
    locationId: orderDetails.LocationId,
    status: orderDetails.status,
    items: orderDetails.OrderItems.map(orderItem => ({
      productId: orderItem.ProductId,
      vlId: orderItem.VariantLocation.id,
      quantity: orderItem.quantity,
      options: orderItem.OrderItemOptions.map(option => option.Option.id),
      topons: orderItem.OrderItemTopons.map(topon => ({
        toponId: topon.GroupToponsMid.id,
        quantity: topon.quantity
      })),
      ingredients: orderItem.OrderItemIngredients.map(ingredient => ({
        ingredientId: ingredient.VariantIngredient.id
      }))
    }))
  };
};

// Calculate the total price of an order
const calculateTotalPrice = async (order) => {
  try {
    let totalPrice = 0;
    for (const item of order.items) {
      if (item.type === 'single') {
        totalPrice += await getSingleItemTotalPrice(item);
      } else if (item.type === 'combo') {
        totalPrice += await getComboItemTotalPrice(item);
      }
    }
    return totalPrice;
  } catch (error) {
    console.error('Error calculating total price:', error.message);
    throw error;
  }
};

const fetchSingleSKURules = async (id, t) => {
  return await VariantLocation.findOne({
    where: { id },
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
  }, { transaction: t });
};

const fetchComboSKURules = async (id, t) => {
  return await VariantLocation.findOne({
    where: { id },
    attributes: ['id'],
    include: [
      {
        model: Variant,
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
                        model: IngredientSKURule,
                        as: 'VarIngRule',
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
  }, { transaction: t });
};

const fetchToponSKURules = async (id, t) => {
  return await GroupToponsMid.findOne({
    where: { id },
    attributes: ['id'],
    include: [
      {
        model: ToponSKURule,
        as: 'TSRule',
        required: false,
        attributes: ['id', 'quantity', 'SKUId', 'unit']
      }
    ]
  }, { transaction: t });
};

const mapSKUData = (items) => {
  const result = [];

  items.forEach(item => {
    const productQuantity = item.quantity;

    if (item.topons) {
      item.topons.forEach(topon => {
        const toponQuantity = topon.quantity;
        const toponRuleQuantity = topon.data.TSRule?.quantity || 0;

        if (topon.data.TSRule) {
          result.push({
            SKUID: topon.data.TSRule.SKUId,
            quantity: toponQuantity * productQuantity * toponRuleQuantity
          });
        }
      });
    }

    if (item.data.VarLocRule) {
      result.push({
        SKUID: item.data.VarLocRule.SKUId,
        quantity: productQuantity * item.data.VarLocRule.quantity
      });
    }

    if (item.data.VarLocIng) {
      item.data.VarLocIng.forEach(ingredient => {
        if (ingredient.VarIngRule) {
          result.push({
            SKUID: ingredient.VarIngRule.SKUId,
            quantity: productQuantity * ingredient.VarIngRule.quantity
          });
        }
      });
    }

    if (item.data.VarLoc) {
      item.data.VarLoc.LinkVar.forEach(linkVar => {
        if (linkVar.LinkVarLoc.VarLocRule) {
          result.push({
            SKUID: linkVar.LinkVarLoc.VarLocRule.SKUId,
            quantity: productQuantity * linkVar.quantity * linkVar.LinkVarLoc.VarLocRule.quantity
          });
        }

        if (linkVar.LinkVarLoc.VarLocIng) {
          linkVar.LinkVarLoc.VarLocIng.forEach(ingredient => {
            if (ingredient.VarIngRule) {
              result.push({
                SKUID: ingredient.VarIngRule.SKUId,
                quantity: productQuantity * ingredient.VarIngRule.quantity * linkVar.quantity
              });
            }


          });
        }

      });
    }
  });

  return result;
};

const updateStock = async (skuData, t) => {
  const skuPromises = skuData.map(async (data) => {
    const sku = await SKU.findOne({ where: { id: data.SKUID } }, { transaction: t });

    if (!sku) {
      throw new Error('SKU not found');
    }

    // if (sku.stock < data.quantity && !sku.allowMinus) {
    //   throw new Error('Insufficient stock');
    // }

    return sku.update({ stock: sku.stock - data.quantity }, { transaction: t });
  });

  await Promise.all(skuPromises);
};

const updateSKU = async (items, t) => {
  const promises = [];

  for (const item of items) {
    const pType = await Product.findOne({
      where: { id: item.productId },
      attributes: ['type']
    }, { transaction: t });

    switch (pType.type) {
      case 'single':
        promises.push(fetchSingleSKURules(item.vlId, t).then(rules => {
          item.data = rules;
        }));
        break;

      case 'combo':
        promises.push(fetchComboSKURules(item.vlId, t).then(rules => {
          item.data = rules;
        }));
        break;
    }

    for (const topon of item.topons) {
      promises.push(fetchToponSKURules(topon.toponId, t).then(rules => {
        topon.data = rules;
      }));
    }
  }

  await Promise.all(promises);
  const skuData = mapSKUData(items);
  await updateStock(skuData, t);

  return items;
};


module.exports = { createOrderJson, getOrderDetails, getOrderTotalPrice, updateSKU, calculateTotalPrice };
