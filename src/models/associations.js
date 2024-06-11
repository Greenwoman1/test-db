const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const OrderItem = require('./OrderItem');
const CartItem = require('./CartItem');
const OrderDetail = require('./OrderDetail');


Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

OrderDetail.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
OrderItem.belongsTo(OrderDetail, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(OrderDetail, { foreignKey: 'user_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
OrderDetail.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(CartItem, { foreignKey: 'user_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });


module.exports = { User, Product, Category, OrderItem, OrderDetail, CartItem };
