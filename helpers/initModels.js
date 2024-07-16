const sequelize = require("../sequelize");
const { Product, Variant, Option, Topons, SKURule, GroupRule, User,
  VariantTopons,
  SKU, Location,
  VariantSKUs, Image,
  GroupOptions,
  PriceHistory,
  GroupTopons,

  ComboVariants,
  GroupToponsMid,
  Order,
  ProductT,
  ProductO,
  OrderItems,
  UserLocation,
  OrderItemsCombo,
  Balance,
  ToponSKUs,

} = require("../src");

async function initModels() {
  const models = [
    User,
    Product,
    Variant,
    GroupOptions,
    Topons,
    SKURule,
    Option,
    VariantTopons,
    SKU,
    Location,
    VariantSKUs,
    Image,
    PriceHistory,
    GroupTopons,

    ComboVariants,
    GroupToponsMid,
    Order,
    OrderItems,
    ProductO,
    ProductT,
    UserLocation,
    OrderItemsCombo,
    Balance,
    ToponSKUs
  ];

  for (const model of models) {
    // console.log(`Initializing model: ${model}`);
    model.initModel();
    // console.log(`Model init finish`);
  }
}

async function associateModels() {
  const models = {
    'Product': Product,
    'Variant': Variant,
    'Option': Option,
    'Topons': Topons,
    // "Combo": Combo,
    'SKURule': SKURule,
    'VariantTopons': VariantTopons,
    'User': User,
    'SKU': SKU,
    'Location': Location,
    'VariantSKUs': VariantSKUs,
    'Image': Image,
    'GroupOptions': GroupOptions,
    'PriceHistory': PriceHistory,
    'GroupTopons': GroupTopons,
    'ComboVariants': ComboVariants,
    'GroupToponsMid': GroupToponsMid,
    'Order': Order,
    'OrderItems': OrderItems,
    'ProductO': ProductO,
    'ProductT': ProductT,
    'UserLocation': UserLocation,
    'OrderItemsCombo': OrderItemsCombo,
    'Balance': Balance,
    'ToponSKUs': ToponSKUs
  }

  for (const [key, model] of Object.entries(models)) {
    if (model.associateModel) {
      model.associateModel(models);
    } else {
      console.warn(`associateModel nije definiran za model ${key}`);
    }
  }
}


const init = async () => {
  await initModels();
  await associateModels();
}
module.exports = init;
