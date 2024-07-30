const { OrderItems, Order, ItemProduct, ProductT, Variant, PriceHistory, Product, Topons, Op, User, Location, Option, OrderItemsCombo, ComboVariants, Balance, OrderItemOptions, OrderItemTopons } = require("../.");
const redisClient = require("../../redisClient");
const sequelize = require('../../sequelize');
const { getBalance, setBalance } = require("../Balance/utils");
const { getVariantSKU } = require("../Variant/utils");

const { createOrderJson, getOrderDetails, getOrderTotalPrice, orderAdjustments } = require("./utils");

/* const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 */





// const createOrder = async (req, res) => {
//   const order = req.body;
//   const errors = [];

//   const userId = order.userId;
//   const locationId = order.locationId;
//   const productIds = order.orderItems.map(item => item.productId);
//   const variantIds = order.orderItems.flatMap(item =>
//     item.type === 'single' ? [item.variantId] : item.comboVariants.map(cv => cv.variantId)
//   );
//   const optionIds = order.orderItems.flatMap(item =>
//     item.type === 'single' ? item.options.map(opt => opt.optionId) : item.comboVariants.flatMap(cv => cv.options.map(opt => opt.optionId))
//   );
//   const toponIds = order.orderItems.flatMap(item =>
//     item.type === 'single' ? item.topons.map(id => id.toponId) : item.comboVariants.flatMap(cv => cv.topons.map(top => top.toponId))
//   );

//   try {
//     const [user, location, products, variants, options, topons] = await Promise.all([
//       User.findByPk(userId),
//       Location.findByPk(locationId),
//       Product.findAll({ where: { id: productIds } }),
//       Variant.findAll({ where: { id: variantIds } }),
//       Option.findAll({ where: { id: optionIds } }),
//       Topons.findAll(),
//     ]);

//     if (!user) {
//       errors.push({ msg: `User with ID (${userId}) does not exist`, param: 'userId', location: 'body' });
//     }

//     if (!location) {
//       errors.push({ msg: `Location with ID (${locationId}) does not exist`, param: 'locationId', location: 'body' });
//     }

//     const existingProductIds = products.map(p => p.id);
//     const missingProductIds = productIds.filter(id => !existingProductIds.includes(id));
//     if (missingProductIds.length > 0) {
//       errors.push({ msg: `Products with IDs (${missingProductIds.join(', ')}) do not exist`, param: 'productIds', location: 'body' });
//     }

//     const existingVariantIds = variants.map(v => v.id);
//     const missingVariantIds = variantIds.filter(id => !existingVariantIds.includes(id));
//     if (missingVariantIds.length > 0) {
//       errors.push({ msg: `Variants with IDs (${missingVariantIds.join(', ')}) do not exist`, param: 'variantIds', location: 'body' });
//     }

//     const existingOptionIds = options.map(o => o.id);
//     const missingOptionIds = optionIds.filter(id => !existingOptionIds.includes(id));
//     if (missingOptionIds.length > 0) {
//       errors.push({ msg: `Options with IDs (${missingOptionIds.join(', ')}) do not exist`, param: 'optionIds', location: 'body' });
//     }

//     const existingToponIds = topons.map(t => t.id);
//     const missingToponIds = toponIds.filter(id => !existingToponIds.includes(id));
//     if (missingToponIds.length > 0) {
//       errors.push({ msg: `Topons with IDs (${missingToponIds.join(', ')}) do not exist`, param: 'toponIds', location: 'body' });
//     }

//     const cachedBalance = await getBalance(userId);
//     let totalPrice = 0;

//     for (const item of order.orderItems) {
//       if (item.type === 'single') {
//         const v = await Variant.findByPk(item.variantId);
//         const variantPrice = await v.getPrice(new Date());
//         let itemTotalPrice = variantPrice * item.quantity;
//         for (const topon of item.topons) {
//           const t = await Topons.findByPk(topon.toponId);
//           const toponPrice = await t.getPrice(new Date());
//           itemTotalPrice += toponPrice * topon.quantity * item.quantity;
//         }
//         totalPrice += itemTotalPrice;
//       } else if (item.type === 'combo') {
//         let comboTotalPrice = 0;
//         const p = await Product.findByPk(item.productId);
//         console.log(p.id);
//         const productPrice = await p.getPrice(new Date());
//         comboTotalPrice += productPrice;
//         for (const comboVariant of item.comboVariants) {
//           for (const topon of comboVariant.topons) {
//             const t = await Topons.findByPk(topon.toponId);
//             const toponPrice = await t.getPrice(new Date());
//             comboTotalPrice += toponPrice * topon.quantity;
//           }
//         }
//         totalPrice += comboTotalPrice * item.quantity;
//       }
//     }

//     if (totalPrice > cachedBalance || cachedBalance == null) {
//       errors.push({ msg: 'Insufficient balance', param: 'totalPrice', location: 'body' });
//     }

//     if (errors.length > 0) {
//       res.status(400).json({ errors });
//       return;
//     }

//     const result = await sequelize.transaction(async (t) => {
//       const totalPrice = await getOrderTotalPrice(order);
//       const O = await Order.create({
//         UserId: order.userId,
//         LocationId: order.locationId,
//         status: order.status,
//         totalPrice: totalPrice
//       }, { transaction: t });

//       await createOrderJson(req.body, O, t);
//       await setBalance(userId, -totalPrice, 'Order', 'Order created', O.id, t);
//       return O;
//     });

//     const orderDetails = await getOrderDetails(result.id);
//     res.status(201).json(orderDetails);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }


const createOrder = async (req, res) => {
  try {
    const order = req.body;

    const o = await Order.create({ UserId: order.userId, LocationId: order.locationId, status: 'pending', totalPrice: 13.5 });

    for (const item of order.items) {
      const OI = await OrderItems.create({ OrderId: o.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity });
      for (const option of item.options) {
        await OrderItemOptions.create({ OrderItemId: OI.id, OptionId: option });
      }
      for (const topon of item.topons) {
        await OrderItemTopons.create({ OrderItemId: OI.id, ToponLocationId: topon.id, quantity: topon.quantity });
      }
    }


    res.status(201).json({ message: 'Order created' });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

}


const proccessOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderAdj = req.body;
    if (Object.keys(orderAdj).length === 0) {
      await AcceptOrder(orderId);

    }

    const result = await sequelize.transaction(async (t) => {
      await setBalance(order.UserId, +order.totalPrice, 'Order-adjustment', 'Order adjusted', order.id, t);

      const newOrder = await orderAdjustments(orderAdj, orderId, t);
      await order.update({ status: "adjustment" }, { transaction: t });

      return newOrder;
    });

    const orderDetails = await getOrderDetails(result.id);
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



const rejectOrder = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error('Order not found');
      }

      await setBalance(order.UserId, +order.totalPrice, 'Order-rejection', 'Order rejected', order.id);
      await order.update({ status: "rejected" }, { transaction: t });
    });

    res.status(200).json({ message: "Order rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = { createOrder, proccessOrder, rejectOrder };