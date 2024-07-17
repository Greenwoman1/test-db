const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantIngredients extends Model {
  static initModel() {
    VariantIngredients.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        }

      },

      {
        sequelize,
        modelName: 'VariantIngredients',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {


    VariantIngredients.hasOne(models.IngredientSKURule);


  }
}

module.exports = VariantIngredients;
