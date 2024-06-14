const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class GroupRules extends Model {}

GroupRules.init(
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
        rule: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    
    },
    {
        sequelize,
        modelName: 'GroupRules',
        timestamps: true,
        createdAt: false,
    },
);



module.exports = GroupRules;