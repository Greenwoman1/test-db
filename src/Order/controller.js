const { OrderItem, Order, ItemProduct, ProductT, Variant, PriceHistory, Product, Topon, Op, User, Location, Option, OrderItemCombo, ComboVariants, Balance, OrderItemOption, OrderItemTopons, VariantLocation, VariantPrice, GroupToponsMid } = require("../.");
const paginate = require("../../helpers/paginate.js");
const redisClient = require("../../redisClient");
const sequelize = require('../../sequelize');
const { getBalance, setBalance } = require("../Balance/utils");
const { getVariantSKU } = require("../Variant/utils");
const { create, update } = require("./Order");

const { createOrderJson, getOrderDetails, getOrderTotalPrice, orderAdjustments, updateSKU, calculateTotalPrice } = require("./utils");



const getOrderDetailsById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw createError(`Order with ID (${orderId}) not found`, 404);
    }

    const od = await getOrderDetails(orderId);
    return res.status(200).json(od);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const queryOptions = {
      
    };

    const paginatedOrders = await paginate(Order, queryOptions);

    res.status(200).json(paginatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = req.body;
    const errors = [];

    const userId = order.userId;
    const locationId = order.locationId;
    const productIds = order.items.map(item => item.productId);
    const variantLocationIds = order.items.map(item => item.vlId);
    const optionIds = order.items.flatMap(item => item.options);
    const toponIds = order.items.flatMap(item => item.topons.map(topon => topon.toponId));

    const [user, location, products, variantLocations, options, topons] = await Promise.all([
      User.findByPk(userId),
      Location.findByPk(locationId),
      Product.findAll({ where: { id: productIds } }),
      VariantLocation.findAll({ where: { id: variantLocationIds } }),
      Option.findAll({ where: { id: optionIds } }),
      GroupToponsMid.findAll({ where: { id: toponIds } }),
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

    const existingVariantLocationIds = variantLocations.map(vl => vl.id);
    const missingVariantLocationIds = variantLocationIds.filter(id => !existingVariantLocationIds.includes(id));
    if (missingVariantLocationIds.length > 0) {
      errors.push({ msg: `VariantLocations with IDs (${missingVariantLocationIds.join(', ')}) do not exist`, param: 'variantLocationIds', location: 'body' });
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
      return res.status(401).json({ errors });
    }

    const tp = await calculateTotalPrice(order);
    const userBalance = await getBalance(userId);

    order.totalPrice = tp;

    if (userBalance === null || userBalance < tp) {
      throw createError('Insufficient funds', 400);
    }

    const result = await sequelize.transaction(async (t) => {
      const o = await createOrderJson(order, t);
      return o;
    });

    const u = await User.findByPk(order.userId);
    await setBalance(u.id, -result.totalPrice, 'Order', 'Order created', result.id);

    return res.status(201).json({ message: 'Order created' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const processOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const o = req.body;
    const errors = [];


    // #region validate
    const userId = o.userId;
    const locationId = o.locationId;
    const productIds = o.items.map(item => item.productId);
    const variantLocationIds = o.items.map(item => item.vlId);
    const optionIds = o.items.flatMap(item => item.options);
    const toponIds = o.items.flatMap(item => item.topons.map(topon => topon.toponId));

    const [user, location, products, variantLocations, options, topons] = await Promise.all([
      User.findByPk(userId),
      Location.findByPk(locationId),
      Product.findAll({ where: { id: productIds } }),
      VariantLocation.findAll({ where: { id: variantLocationIds } }),
      Option.findAll({ where: { id: optionIds } }),
      GroupToponsMid.findAll({ where: { id: toponIds } }),
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

    const existingVariantLocationIds = variantLocations.map(vl => vl.id);
    const missingVariantLocationIds = variantLocationIds.filter(id => !existingVariantLocationIds.includes(id));
    if (missingVariantLocationIds.length > 0) {
      errors.push({ msg: `VariantLocations with IDs (${missingVariantLocationIds.join(', ')}) do not exist`, param: 'variantLocationIds', location: 'body' });
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
      throw createError(errors.map(e => e.msg).join('; '), 400);
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      throw createError('Order not found', 404);
    }

    // #endregion

    const res = await sequelize.transaction(async (transaction) => {
      const result = await sequelize.transaction(async (t) => {
        const object = req.body;
        const prevOrder = await Order.findByPk(orderId, { transaction: t });
        await prevOrder.update({ status: "adjustment" }, { transaction: t });

        const newOrder = await createOrderJson(object, t);
        const tp = await calculateTotalPrice(object);
        await newOrder.update({ totalPrice: tp, status: "done" }, { transaction: t });
        await newOrder.save({ transaction: t });
        return newOrder;
      });

      const orderDetails = await getOrderDetails(result.id);
      await sequelize.transaction(async (t) => { await updateSKU(orderDetails.items, transaction); });

      await setBalance(order.UserId, +order.totalPrice, 'prevOrder', 'prevOrder processed', order.id);
      await setBalance(result.UserId, -result.totalPrice, 'order', 'Order processed', result.id);


    })

    return res.status(200).json({ message: 'Order processed successfully' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};



const acceptOrder = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error('Order not found');
      }
      const orderInfo = await getOrderDetails(orderId, t);
      await updateSKU(orderInfo.items, t);
      await order.update({ status: "accepted" }, { transaction: t });
    });

    res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" + error.message });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error('Order not found');
      }

      await setBalance(order.UserId, + order.totalPrice, 'Order-rejection', 'Order rejected', order.id, { transaction: t });
      await order.update({ status: "rejected" }, { transaction: t });
    });

    res.status(200).json({ message: "Order rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const listByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const loc = await Location.findByPk(locationId, {
      attributes: ['id', 'name'],
    });

    if (!loc) {
      return res.status(401).json({ message: `Location with id ${locationId} not found` });
    }

    const queryOptions = {
      where: { LocationId: locationId },
      include: [
        { model: User },
        { model: Location },
      ],
    };

    const paginatedOrders = await paginate(Order, queryOptions);

    res.status(200).json(paginatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { createOrder, processOrder, rejectOrder, acceptOrder, getOrderDetailsById, getOrders, listByLocation };