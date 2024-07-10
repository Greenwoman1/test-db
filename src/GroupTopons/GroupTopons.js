const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const GroupOption = require('../GroupOptions/GroupOptions');

class GroupTopons extends Model {
  static initModel() {
    GroupTopons.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          },
        },
        type: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          },
        },
        rules: {
          type: DataTypes.JSON
        }
      },
      {
        sequelize,
        modelName: 'GroupTopons',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    GroupOption.belongsTo(models.Variant);
    GroupTopons.belongsToMany(models.Topons, { through: 'GroupToponsMid' });
  }
}

module.exports = GroupTopons;
