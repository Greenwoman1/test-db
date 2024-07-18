const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class SKURule extends Model {
  static initModel() {
    SKURule.init(
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
        modelName: 'SKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {

    SKURule.belongsTo(models.SKU);
    SKURule.belongsTo(models.VariantLocations)
    SKURule.belongsTo(models.VariantIngredients)


  }
}

module.exports = SKURule;
