const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Combo extends Model {}

Combo.init(
    {
        id : {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
 
    },
    {
        sequelize,
        modelName: 'Combo',
        timestamps: true,
    },
);



module.exports = Combo;