const sequelize = require("../sequelize");
const {
  Balance,
  GroupOptions,
  GroupTopon,
  GroupToponsMid,
  Image,
  Ingredients,
  Location,
  Option,
  Order,
  OrderItems,
  // OrderItemsCombo,
  Product,
  OrderItemOptions,
  OrderItemTopons,
  SKU,
  VariantSKURule,
  IngredientSKURule,
  Topons,
  ToponSKURule,
  User,
  UserLocation,
  Variant,
  VariantIngredients,
  VariantLocations,
  Warehouse,
  WarehouseLocations,
  LinkedVariants,
  ToponPrice,
  VariantPrice,
  ToponLocations,
  IngredientLocations,
  Category,
  UserPayment,
  Payment


} = require("../src");

async function initModels() {
  const models = [
    Balance,
    GroupOptions,
    GroupTopon,
    GroupToponsMid,
    Image,
    Ingredients,
    Location,
    Option,
    Order,
    OrderItems,
    // OrderItemsCombo,
    ToponPrice,
    VariantPrice,
    Product,
    OrderItemOptions,
    OrderItemTopons,
    SKU,

    VariantSKURule,
    IngredientSKURule,
    Topons,
    ToponSKURule,
    User,
    UserLocation,
    Variant,
    VariantIngredients,
    VariantLocations,
    Warehouse,
    WarehouseLocations,
    LinkedVariants,

    ToponLocations,

    IngredientLocations,

    Category,

    UserPayment,

    Payment

  ];

  for (const model of models) {
    // console.log(`Initializing model: ${model}`);
    model.initModel();
    // console.log(`Model init finish`);
  }
}

async function associateModels() {
  const models = {

    'Balance': Balance,

    'GroupOptions': GroupOptions,
    'GroupTopon': GroupTopon,
    'GroupToponsMid': GroupToponsMid,
    'Image': Image,
    'Ingredients': Ingredients,
    'Location': Location,
    'Option': Option,
    'Order': Order,
    'OrderItems': OrderItems,
    // 'OrderItemsCombo': OrderItemsCombo,
    'VariantPrice': VariantPrice,
    'ToponPrice': ToponPrice,
    'Product': Product,
    'OrderItemOptions': OrderItemOptions,
    'OrderItemTopons': OrderItemTopons,
    'SKU': SKU,

    'VariantSKURule': VariantSKURule,
    'IngredientSKURule': IngredientSKURule,
    'Topons': Topons,
    'ToponSKURule': ToponSKURule,
    'User': User,
    'UserLocation': UserLocation,
    'Variant': Variant,
    'VariantIngredients': VariantIngredients,
    'VariantLocations': VariantLocations,
    'Warehouse': Warehouse,
    'WarehouseLocations': WarehouseLocations,
    'LinkedVariants': LinkedVariants,

    'ToponLocations': ToponLocations,

    'IngredientLocations': IngredientLocations,

    'Category': Category,

    'UserPayment': UserPayment,

    'Payment': Payment

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
