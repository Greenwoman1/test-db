const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Variant extends Model {}

Variant.init(
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
        
    
    },
    {
        sequelize,
        modelName: 'Variant',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
    },
);



module.exports = Variant;