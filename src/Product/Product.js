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
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
      
    
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