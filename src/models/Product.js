const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        category:{
            type: DataTypes.INTEGER,
        },
        price: {
            type: DataTypes.FLOAT,
        },
        owner: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
    },
);



module.exports = Product;