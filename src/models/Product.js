const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class Product extends Model {}

Product.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
        },
        category:{
            type: DataTypes.INTEGER,
        },
        price: {
            type: DataTypes.FLOAT,
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