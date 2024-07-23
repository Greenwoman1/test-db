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
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        },
        type: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        },
        rules: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        }

      },
      {
        sequelize,
        modelName: 'GroupOptions',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {
    GroupOption.belongsTo(models.Variant);
    GroupOption.hasMany(models.Option);
  }
}

module.exports = GroupOption;
