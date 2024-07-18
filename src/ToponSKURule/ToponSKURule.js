const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class ToponSKURule extends Model {
  static initModel() {
    ToponSKURule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        unit: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'ToponSKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {

    ToponSKURule.belongsTo(models.GroupToponsMid);
    ToponSKURule.belongsTo(models.SKU);

  }
}

module.exports = ToponSKURule;
