const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantTopons extends Model {}

VariantTopons.init(
    {
        
       
    
    },
    {
        sequelize,
        modelName: 'VariantTopons',
        timestamps: true,

    },
);



module.exports = VariantTopons;