const { OrderItems, Order, ItemProduct, ProductT, Variant, PriceHistory, Product, Topons, Op, User, Location, Option } = require("../.");

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
  const { userId, locationId, products } = req.body;
  let errors = [];
  try {


    const [user, location] = await Promise.all([
      User.findByPk(userId),
      Location.findByPk(locationId)
    ]);

    if (!user) {
      errors.push({ msg: `User with ID (${userId}) does not exist`, param: 'userId', location: 'body' });
    }

    if (!location) {
      errors.push({ msg: `Location with ID (${locationId}) does not exist`, param: 'locationId', location: 'body' });
    }
    for (const product of products) {
      const { productId, variantId, options, topons } = product;

      const [existingProduct, existingVariant] = await Promise.all([
        Product.findByPk(productId),
        Variant.findByPk(variantId)
      ]);

      if (!existingProduct) {
        errors.push({ msg: `Product with ID (${productId}) does not exist`, param: 'productId', location: 'body' });
      }

      if (!existingVariant) {
        errors.push({ msg: `Variant with ID (${variantId}) does not exist`, param: 'variantId', location: 'body' });
      }

      if (options && options.length > 0) {
        const existingOptions = await Option.findAll({ where: { id: options } });
        const missingOptions = options.filter(id => !existingOptions.map(option => option.id).includes(id));

        if (missingOptions.length > 0) {
          errors.push({ msg: `Options with IDs (${missingOptions.join(', ')}) do not exist`, param: 'options', location: 'body' });
        }
      }

      if (topons && topons.length > 0) {
        const existingTopons = await Topons.findAll({ where: { id: topons } });
        const missingTopons = topons.filter(id => !existingTopons.map(topon => topon.id).includes(id));

        if (missingTopons.length > 0) {
          errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }



    const order = await createOrderJson(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { getOrders, createOrder }