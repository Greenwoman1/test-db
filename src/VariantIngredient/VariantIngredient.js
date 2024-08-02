const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantIngredient extends Model {
  static initModel() {
    VariantIngredient.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        }

      },

      {
        sequelize,
        modelName: 'VariantIngredient',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    VariantIngredient.belongsTo(models.VariantLocation, {as: 'VL_VI', foreignKey: 'VariantLocationId'});
    VariantIngredient.belongsTo(models.IngredientLocation, {as: 'VarIng', foreignKey: 'IngredientLocationId'} );


    VariantIngredient.hasOne(models.IngredientSKURule, {as: 'VI_Rule', foreignKey: 'VariantIngredientId'});

    VariantIngredient.hasMany(models.OrderItemIngredient);


  }
}

module.exports = VariantIngredient;
