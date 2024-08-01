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
    VariantIngredients.belongsTo(models.VariantLocations, {as: 'VL_VI', foreignKey: 'VariantLocationId'});
    VariantIngredients.belongsTo(models.IngredientLocations, {as: 'IL_VI', foreignKey: 'IngredientLocationId'} );


    VariantIngredients.hasOne(models.IngredientSKURule, {as: 'VI_Rule', foreignKey: 'VariantIngredientId'});

    VariantIngredients.hasMany(models.OrderItemIngredients);


  }
}

module.exports = VariantIngredients;
