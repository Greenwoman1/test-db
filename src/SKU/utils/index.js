const SKU = require("../SKU");

const updateSKU = async (item) => {
  try {


    const { quantity, Variant } = item;
    const { Locations } = Variant;

    const location = Locations[0];
    const skuId = location.SKUs[0].id;

    const sku = await SKU.findByPk(skuId);

    if (!sku) {
      console.error('SKU not found');
      return;
    }

    let stock = parseInt(sku.stock, 10);

    stock -= quantity;

    if (stock < 0) {
      console.warn('Stock cannot be negative. Setting stock to 0.');
      stock = 0;
    }

    await SKU.update({ stock }, { where: { id: skuId } });

    console.log(`SKU stock updated successfully. New stock: ${stock}`);

  } catch (error) {
    console.error("Error while updating SKU stock:", error);
  }
};


module.exports = { updateSKU }