const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class IngredientLocation extends Model {
  static initModel() {
    IngredientLocation.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
     

      },

      {
        sequelize,
        modelName: 'IngredientLocation',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    IngredientLocation.hasMany(models.VariantIngredient, {as: 'VarIng', foreignKey: 'IngredientLocationId' } );
    IngredientLocation.belongsTo(models.Ingredient, { as : 'InLoc', foreignKey: 'IngredientId' });
  }
}

module.exports = IngredientLocation;
