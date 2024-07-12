const sequelize = require("../sequelize");
const { Product, Variant, Option, Topons, SKURule, GroupRule, User,
  VariantTopons,
  SKU, Location,
  VariantLocation, Image,
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
  ToponLocations
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
    VariantLocation,
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
    ToponLocations
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
    'VariantLocation': VariantLocation,
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
    'ToponLocations': ToponLocations
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
