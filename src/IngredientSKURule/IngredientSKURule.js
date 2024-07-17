const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class IngredientSKURule extends Model {
  static initModel() {
    IngredientSKURule.init(
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
        modelName: 'IngredientSKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {
    IngredientSKURule.belongsTo(models.VariantIngredients);
    IngredientSKURule.belongsTo(models.SKU);


  }
}

module.exports = IngredientSKURule;
