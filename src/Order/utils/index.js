const { name } = require("ejs");

const { Order, OrderItems, PriceHistory, ProductT, ProductO, OrderItemsCombo, Topons, Variant, ComboVariants, Product } = require("../..");
const createOrderJson = async (orderJson) => {
  try {
    let totalPrice = 0;

    const result = await sequelize.transaction(async (t) => {


      for (const item of orderJson.orderItems) {
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
      }

      const order = await Order.create({
        UserId: orderJson.userId,
        LocationId: orderJson.locationId,
        status: orderJson.status,
        totalPrice: totalPrice
      }, { transaction: t });

      for (const item of orderJson.orderItems) {
        if (item.type === 'single') {
          const orderItem = await OrderItems.create({
            OrderId: order.id,
            VariantId: item.variantId,
            quantity: item.quantity
          }, { transaction: t });

          for (const option of item.options) {
            await ProductO.create({
              OrderItemId: orderItem.id,
              OptionId: option.optionId
            }, { transaction: t });
          }

          for (const topon of item.topons) {
            await ProductT.create({
              OrderItemId: orderItem.id,
              ToponId: topon.toponId,
              quantity: topon.quantity
            }, { transaction: t });
          }
        } else if (item.type === 'combo') {
          const comboVariants = [];
          for (const comboVariant of item.comboVariants) {
            const orderItemCombo = await OrderItems.create({
              OrderId: order.id,
              VariantId: comboVariant.variantId,
              quantity: item.quantity
            }, { transaction: t });

            comboVariants.push(orderItemCombo);

            for (const option of comboVariant.options) {
              await ProductO.create({
                OrderItemId: orderItemCombo.id,
                OptionId: option.optionId
              }, { transaction: t });
            }

            for (const topon of comboVariant.topons) {
              await ProductT.create({
                OrderItemId: orderItemCombo.id,
                ToponId: topon.toponId,
                quantity: topon.quantity
              }, { transaction: t });
            }
          }

          for (const comboVariant of comboVariants) {
            const cv = await ComboVariants.findOne({ where: { ProductId: item.productId, VariantId: comboVariant.VariantId } });;
            await OrderItemsCombo.create({
              OrderItemId: comboVariant.id,
              ComboVariantId: cv.id,
              OrderId: order.id
            }, { transaction: t });
          }
        }
      }

      return order;
    });

    return result;

  } catch (error) {
    console.error("Error while creating order:", error);
  }
};




module.exports = { createOrderJson };
