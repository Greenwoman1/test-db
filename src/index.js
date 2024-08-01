const User = require('./User/User');
const Product = require('./Product/Product');
const GroupOptions = require('./GroupOptions/GroupOptions');
const Option = require('./Option/Option');
const Variant = require('./Variant/Variant');
const SKU = require('./SKU/SKU');
const Location = require('./Location/Location');
const Image = require('./Image/Image');
const GroupToponsMid = require('./GroupToponsMid/GroupToponsMid');
const Order = require('./Order/Order');
const OrderItems = require('./OrderItems/OrderItems');
const ToponPrice = require('./ToponPrice/ToponPrice');
const VariantPrice = require('./VariantPrice/VariantPrice');
const UserLocation = require('./UserLocation/UserLocation');
const Balance = require('./Balance/balance');

const VariantSKURule = require('./VariantSKURule/VariantSKURule');
const IngredientSKURule = require('./IngredientSKURule/IngredientSKURule');
const Ingredients = require('./Ingredients/Ingredients');
const Warehouse = require('./Warehouse/Warehouse');
const WarehouseLocations = require('./WarehouseLocations/WarehouseLocations');
const VariantLocations = require('./VariantLocations/VariantLocations');
const VariantIngredients = require('./VariantIngredients/VariantIngredients');
const GroupTopon = require('./GroupTopon/GroupTopon');
const ToponSKURule = require('./ToponSKURule/ToponSKURule');
const Topons = require('./Topons/Topons');
const LinkedVariants = require('./LinkedVariants/LinkedVariants');
const ToponLocations = require('./ToponLocations/ToponLocations');
const IngredientLocations = require('./IngredientLocations/IngredientLocations');
const Category = require('./Category/Category');
const UserPayment = require('./UserPayment/UserPayment');
const OrderItemOptions = require('./OrderItemOptions/OrderItemOptions');
const OrderItemTopons = require('./OrderItemTopons/OrderItemTopons');
const Payment = require('./Payment/Payment');
const WaiterBreak = require('./WaiterBreak/WaiterBreak');
const Role = require('./Role/Role');
const Permissions = require('./Permissions/Permissions');
const RolePermission = require('./RolePermission/RolePermission');
const UserRole = require('./UserRole/UserRole');
const UserPermission = require('./UserPermission/UserPermission');
const UserAdditionalInfo = require('./UserAdditionalInfo/UserAdditionalInfo');
const OrderItemIngredients = require('./OrderItemIngredients/OrderItemIngredients');


module.exports = {
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

  Payment,
  WaiterBreak,
  Permissions,
  Role,
  RolePermission,

  
  UserRole,

  UserPermission,
  UserAdditionalInfo,

  OrderItemIngredients







} 
