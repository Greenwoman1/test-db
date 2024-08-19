const { OrderItem, Order, ItemProduct, ProductT, Variant, PriceHistory, Product, Topon, Op, User, Location, Option, OrderItemCombo, ComboVariants, Balance, OrderItemOption, OrderItemTopons, VariantLocation, VariantPrice, GroupToponsMid } = require("../.");
const client = require("../../clients/elastics.js");
const createError = require("../../helpers/customError.js");
const paginate = require("../../helpers/paginate.js");
const redisClient = require("../../clients/redisClient");
const sequelize = require('../../clients/sequelize');
const { getBalance, setBalance } = require("../Balance/utils");
const { getVariantSKU } = require("../Variant/utils");
const { create, update } = require("./Order");

const { Transaction } = require('sequelize');


const { createOrderJson, getOrderDetails, getOrderTotalPrice, orderAdjustments, updateSKU, calculateTotalPrice } = require("./utils");
const handleError = require("../../helpers/serverError.js");



const getOrderDetailsById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw createError(`Order with ID (${orderId}) not found`, 404);
    }

    const query = {
      index: 'orders',
      body: {
        "query": {
          "terms": {
            "_id": ["274b3b64-790e-4ad7-8b1f-8ff7c25ed2df"]
          }
        }
      }
    };

    const result = await client.search(query);
    console.log(result);
    if (result.hits.total.value === 0) {
      throw createError(`Order with ID (${orderId}) not found in Elasticsearch`, 404);
    }

    const orderDetails = result.hits.hits[0]._source;

    return res.status(200).json({ ...orderDetails });
  } catch (error) {
    await handleError(error, res);
  }
};
const getOrders = async (req, res) => {
  const { locationId } = req.query; 
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10; 
  const from = (page - 1) * pageSize;

  try {
    const query = {
      index: 'orders',
      body: {
        query: {
          bool: {
            must: [
              { match_all: {} } 
            ],
            filter: []
          }
        },
        from: from,
        size: pageSize
  
      }
    };

    if (locationId) {
      query.body.query.bool.filter.push({ match: { locationId: locationId } });
    }

    const eRes = await client.search(query);

    const paginatedOrders = {
      total: eRes.hits.total.value,
      page,
      pageSize,
      orders: eRes.hits.hits.map(hit => hit._source)
    };

    res.status(200).json(paginatedOrders);
  } catch (error) {
    await handleError(error, res);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = req.body;

    // #region validate

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
      return res.status(400).json({ errors });
    }


    // #endregion validate


    const result = await sequelize.transaction(async (t) => {

      const tp = await calculateTotalPrice(order).catch(e => {
        throw new Error(e);
      });
      const userBalance = await getBalance(userId).catch(e => {
        throw new Error(e);
      });

      order.totalPrice = tp;

      if (userBalance === null || userBalance < tp) {
        throw createError('Insufficient funds', 400);
      }
      const o = await createOrderJson(order, t).catch(e => {
        throw new Error(e);
      });

      const documentToSave = {
        ...order,
        items: order.items.map(item => ({
          productId: item.productId,
          vlId: item.vlId,
          type: item.type,
          quantity: item.quantity,
          options: item.options.map(name => ({
            name
          })),
          topons: item.topons.map(topon => ({
            toponId: topon.toponId,
            quantity: topon.quantity,
          }))
        }))
      };

      await client.index({
        index: 'orders',
        id: o.id,
        document: { ...documentToSave, status: "pending" }
      });

      const u = await User.findByPk(order.userId);
      await setBalance(u.id, -order.totalPrice, 'Order', 'Order created', o.id).catch(e => {
        throw e;
      });

      return o;
    });


    return res.status(201).json({ message: 'Order created', data: result });
  } catch (error) {
    await handleError(error, res);
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
      return createError(errors.map(e => e.msg).join('; '), 400, res);
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return createError('Order not found', 400, res);
    }
    if (order.status !== 'pending') {
      return createError('Order already processed' + order.id, 400, res);
    }

    // #endregion
    const result = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (transaction) => {
        const object = req.body;
        const prevOrder = await Order.findByPk(orderId, { transaction });
        await prevOrder.update({ status: "adjustment" }, { transaction });

        await client.update({
          index: 'orders',
          id: orderId,
          doc: {
            status: "adjustment"
          }
        });

        const newOrder = await createOrderJson(object, transaction);
        await newOrder.save({ transaction });
        const tp = await calculateTotalPrice(object);

        await newOrder.update({ totalPrice: tp, status: "done" }, { transaction });
        await newOrder.save({ transaction });

        await updateSKU(object.items, transaction).catch((e) => {
          throw e;
        });
        await setBalance(order.UserId, +order.totalPrice, 'prevOrder', 'prevOrder processed', order.id);
        await setBalance(newOrder.UserId, -newOrder.totalPrice, 'order', 'Order processed', newOrder.id);

        const documentToSave = {
          ...order,
          items: order.items.map(item => ({
            productId: item.productId,
            vlId: item.vlId,
            type: item.type,
            quantity: item.quantity,
            options: item.options.map(name => ({
              name
            })),
            topons: item.topons.map(topon => ({
              toponId: topon.toponId,
              quantity: topon.quantity,
            }))
          }))
        };

        await client.index({
          index: 'orders',
          id: newOrder.id,
          document: { ...documentToSave }
        });


        return newOrder;
      }
    ).then((newOrder) => res.status(200).json({ message: 'Order processed successfully', order: newOrder.id })).catch((e) => {
      console.log('Transaction error:', e);
      throw e;
    });
  } catch (error) {

    await handleError(error, res);
  }
};


const acceptOrder = async (req, res) => {


  const { orderId } = req.params;
  const order = await Order.findByPk(orderId);
  if (!order) {
    res.status(400).json({ message: 'Order not found' });
    return
  }
  if (order.status !== 'pending') {
    res.status(400).json({ message: 'Order already processed' });
    return
  }

  try {
    const result = await sequelize.transaction(async (t) => {

      const orderInfo = await getOrderDetails(orderId, t);
      await updateSKU(orderInfo.items, t);
      await order.update({ status: "accepted" }, { transaction: t });

      await client.update({
        index: 'orders',
        id: orderId,
        doc: {
          status: "accepted"
        }
      })
    }).catch((e) => {
      console.log('Transaction error:', e);
      throw e;
    });

    res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {
    await handleError(error, res);
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

      await client.update({
        index: 'orders',
        id: orderId,
        document: {
          status: "rejected"
        }
      })

    });

    res.status(200).json({ message: "Order rejected successfully" });
  } catch (error) {
    await handleError(error, res);
  }
};


const listByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const loc = await Location.findByPk(locationId, {
      attributes: ['id', 'name'],
    });
    if (!loc) {
      await createError(`Location with ID (${locationId}) not found`, 404, res);
      return;
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
    await handleError(error, res);
  }
};




module.exports = { createOrder, processOrder, rejectOrder, acceptOrder, getOrderDetailsById, getOrders, listByLocation };