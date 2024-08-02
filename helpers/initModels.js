const sequelize = require("../sequelize");
const {
  Balance,
  GroupOptions,
  GroupTopon,
  GroupToponsMid,
  Image,
  Ingredient,
  Location,
  Option,
  Order,
OrderItem,
  // OrderItemCombo,
  Product,
  OrderItemOption,
  OrderItemTopons,
  SKU,
  VariantSKURule,
  IngredientSKURule,
  Topon,
  ToponSKURule,
  User,
  UserLocation,
  Variant,
  VariantIngredient,
  VariantLocation,
  Warehouse,
  WarehouseLocation,
  LinkedVariant,
  ToponPrice,
  VariantPrice,
  ToponLocation,
  IngredientLocation,
  Category,
  UserPayment,
  Payment,
  OrderItemIngredient,
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
    Ingredient,
    Location,
    Option,
    Order,
    OrderItem,
    OrderItemIngredient,
    ToponPrice,
    VariantPrice,
    Product,
    OrderItemOption,
    OrderItemTopons,
    SKU,

    VariantSKURule,
    IngredientSKURule,
    Topon,
    ToponSKURule,
    User,
    UserLocation,
    Variant,
    VariantIngredient,
    VariantLocation,
    Warehouse,
    WarehouseLocation,
    LinkedVariant,

    ToponLocation,

    IngredientLocation,

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
    'Ingredient': Ingredient,
    'Location': Location,
    'Option': Option,
    'Order': Order,
    'OrderItem': OrderItem,

    'VariantPrice': VariantPrice,
    'ToponPrice': ToponPrice,
    'Product': Product,
    'OrderItemOption': OrderItemOption,
    'OrderItemTopons': OrderItemTopons,
    'SKU': SKU,

    'VariantSKURule': VariantSKURule,
    'IngredientSKURule': IngredientSKURule,
    'Topon': Topon,
    'ToponSKURule': ToponSKURule,
    'User': User,
    'UserLocation': UserLocation,
    'Variant': Variant,
    'VariantIngredient': VariantIngredient,
    'VariantLocation': VariantLocation,
    'Warehouse': Warehouse,
    'WarehouseLocation': WarehouseLocation,
    'LinkedVariant': LinkedVariant,

    'ToponLocation': ToponLocation,

    'IngredientLocation': IngredientLocation,

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
    'OrderItemIngredient': OrderItemIngredient

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
