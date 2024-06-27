const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Variant = require('../Variant/Variant');
const Option = require('../Option/Option');

class GroupOption extends Model {
    static initModel() {
        GroupOption.init(
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
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
             
            },
            {
                sequelize,
                modelName: 'GroupOption',
                timestamps: true,
                createdAt: false,
            }
        );
    }

    static associateModel(models) {
        GroupOption.belongsTo(models.Variant);
        GroupOption.hasMany(models.Option);
        GroupOption.hasMany(models.GroupRule);

    }
}

module.exports = GroupOption;
