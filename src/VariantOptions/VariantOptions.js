const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantOptions extends Model {}

VariantOptions.init(
    {
 
    },
    {
        sequelize,
        modelName: 'VariantOptions',
        timestamps: true,
    },
);



module.exports = VariantOptions;