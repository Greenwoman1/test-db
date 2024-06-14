const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Options extends Model {}

Options.init(
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
        }
        
    
    },
    {
        sequelize,
        modelName: 'Options',
        timestamps: true,
        createdAt: false,
    },
);



module.exports = Options;