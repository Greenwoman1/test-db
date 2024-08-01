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
  Payment,
  OrderItemIngredients,
  WaiterBreak,
  Role,
  Permissions,
  RolePermission,
  UserRole,
  UserPermission,
  UserAdditionalInfo


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
    OrderItemIngredients,
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

    Payment,
    WaiterBreak,
    Role,
    Permissions,
    
  RolePermission,

  UserRole,

  UserPermission,
  UserAdditionalInfo

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

    'Payment': Payment,


    'WaiterBreak': WaiterBreak,

    'Role': Role,

    'Permissions': Permissions,

    'RolePermission': RolePermission,

    'UserRole': UserRole,

    'UserPermission': UserPermission,

    'UserAdditionalInfo': UserAdditionalInfo,
    'OrderItemIngredients': OrderItemIngredients

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
