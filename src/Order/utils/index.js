const { name } = require("ejs");

const { Order, OrderItems, PriceHistory } = require("../..");
const createOrderJson = async (orderJson) => {
  try {
    const { userId, locationId, status, products } = orderJson;

    let totalPrice = 0;


    for (const product of products) {
      const variantPriceEntry = await PriceHistory.getPriceByDate(product.variantId);
      const variantPrice = variantPriceEntry ? parseFloat(variantPriceEntry) : 0;

      let productTotalPrice = variantPrice;
      const toppingPrices = await Promise.all(
        product.topons.map(async (toponId) => {
          const toppingPriceEntry = await PriceHistory.getPriceByDate(toponId);
          return toppingPriceEntry ? parseFloat(toppingPriceEntry) : 0;
        })
      );
      productTotalPrice += toppingPrices.reduce((sum, price) => sum + price, 0);

      productTotalPrice *= product.quantity;
      totalPrice += productTotalPrice;
    }

    const order = await Order.create({
      UserId: userId,
      LocationId: locationId,
      totalPrice,
      status
    });

    for (const product of products) {
      const item = await OrderItems.create({
        ProductId: product.productId,
        status: "pending",
        OrderId: order.id,
        VariantId: product.variantId,
        quantity: product.quantity
      });

      const { options, topons } = product;

      for (const option of options) {
        await item.addOptions(option);
      }

      for (const topon of topons) {
        await item.addTopons(topon);
      }
    }

    return order;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




module.exports = { createOrderJson };
