const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class VariantSKURule extends Model {
  static initModel() {
    VariantSKURule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'VariantSKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {


    VariantSKURule.belongsTo(models.VariantLocations);
    VariantSKURule.belongsTo(models.SKU);
  }
}

module.exports = VariantSKURule;
