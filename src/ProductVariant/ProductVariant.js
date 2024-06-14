const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ProductVariant extends Model {}

ProductVariant.init(
    {
        
        
    
    },
    {
        sequelize,
        modelName: 'ProductVariant',
        timestamps: true,

    },
);



module.exports = ProductVariant;