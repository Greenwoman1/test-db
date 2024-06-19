const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class GroupRule extends Model {
    static associateModel(models) {
        GroupRule.belongsTo(models.GroupOption)
    }

    static initModel() {
        GroupRule.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                ruleType: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                ruleValue: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
            },
            {
                sequelize,
                modelName: 'GroupRule',
                timestamps: true,
                createdAt: false,
            },
        );
    }
}

module.exports = GroupRule;
