const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboItems extends Model {}

ComboItems.init(
    {
 
    },
    {
        sequelize,
        modelName: 'ComboItems',
        timestamps: true,
    },
);



module.exports = ComboItems