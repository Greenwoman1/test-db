const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const OrderItem = require('./OrderDetails');
const OrderDetails = require('./OrderDetails');

User.hasMany(Product, {
    foreignKey: 'owner',
    as: 'products',
    onDelete: 'CASCADE',
    hooks: true,
});
Product.belongsTo(User, { foreignKey: 'owner', as: 'owner' });

Category.hasMany(Product, { as: 'products', onDelete: 'CASCADE', hooks: true, foreignKey: 'category' });

Product.belongsTo(Category, { foreignKey: 'category', as: 'category' });

Product.hasOne(OrderItem, { as: 'orderItem', onDelete: 'CASCADE', hooks: true, foreignKey: 'productId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(OrderDetails, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE',
    hooks: true,
});
OrderDetails.belongsTo(User, { foreignKey: 'userId', as: 'user' });

OrderDetails.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
    hooks: true,
});

OrderItem.belongsTo(OrderDetails, { foreignKey: 'orderId', as: 'order' });

module.exports = { User, Product, Category, OrderItem, OrderDetails };
