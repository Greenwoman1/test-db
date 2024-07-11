const { OrderItems, Order, ItemProduct, ProductT, Variant, PriceHistory, Product, Topons, Op, User, Location, Option, OrderItemsCombo, ComboVariants } = require("../.");
const sequelize = require('../../sequelize');

const { createOrderJson } = require("./utils");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createOrder = async (req, res) => {
  const order = req.body;
  const errors = [];

  const userId = order.userId;
  const locationId = order.locationId;
  const productIds = order.orderItems.map(item => item.productId);
  const variantIds = order.orderItems.flatMap(item =>
    item.type === 'single' ? [item.variantId] : item.comboVariants.map(cv => cv.variantId)
  );
  const optionIds = order.orderItems.flatMap(item =>
    item.type === 'single' ? item.options.map(opt => opt.optionId) : item.comboVariants.flatMap(cv => cv.options.map(opt => opt.optionId))
  );
  const toponIds = order.orderItems.flatMap(item =>
    item.type === 'single' ? item.topons.map(top => top.toponId) : item.comboVariants.flatMap(cv => cv.topons.map(top => top.toponId))
  );

  try {
    const [user, location, products, variants, options, topons] = await Promise.all([
      User.findByPk(userId),
      Location.findByPk(locationId),
      Product.findAll({ where: { id: productIds } }),
      Variant.findAll({ where: { id: variantIds } }),
      Option.findAll({ where: { id: optionIds } }),
      Topons.findAll({ where: { id: toponIds } }),
    ]);



    if (!user) {
      errors.push({ msg: `User with ID (${userId}) does not exist`, param: 'userId', location: 'body' });
    }

    if (!location) {
      errors.push({ msg: `Location with ID (${locationId}) does not exist`, param: 'locationId', location: 'body' });
    }

    const existingProductIds = products.map(p => p.id);
    const missingProductIds = productIds.filter(id => !existingProductIds.includes(id));
    if (missingProductIds.length > 0) {
      errors.push({ msg: `Products with IDs (${missingProductIds.join(', ')}) do not exist`, param: 'productIds', location: 'body' });
    }

    const existingVariantIds = variants.map(v => v.id);
    const missingVariantIds = variantIds.filter(id => !existingVariantIds.includes(id));
    if (missingVariantIds.length > 0) {
      errors.push({ msg: `Variants with IDs (${missingVariantIds.join(', ')}) do not exist`, param: 'variantIds', location: 'body' });
    }

    const existingOptionIds = options.map(o => o.id);
    const missingOptionIds = optionIds.filter(id => !existingOptionIds.includes(id));
    if (missingOptionIds.length > 0) {
      errors.push({ msg: `Options with IDs (${missingOptionIds.join(', ')}) do not exist`, param: 'optionIds', location: 'body' });
    }

    const existingToponIds = topons.map(t => t.id);
    const missingToponIds = toponIds.filter(id => !existingToponIds.includes(id));
    if (missingToponIds.length > 0) {
      errors.push({ msg: `Topons with IDs (${missingToponIds.join(', ')}) do not exist`, param: 'toponIds', location: 'body' });
    }


    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }


    const result = await sequelize.transaction(async (t) => {

      const order = await createOrderJson(req.body, t);

      return order

    });


    const orderDetails = await Order.findOne({
      where: { id: result.id },
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
    res.status(201).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { getOrders, createOrder }