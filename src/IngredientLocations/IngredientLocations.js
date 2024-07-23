const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class IngredientLocations extends Model {
  static initModel() {
    IngredientLocations.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
     

      },

      {
        sequelize,
        modelName: 'IngredientLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    IngredientLocations.hasMany(models.VariantIngredients);
    IngredientLocations.belongsTo(models.Ingredients, { as : 'IL', foreignKey: 'IngredientId' });
  }
}

module.exports = IngredientLocations;
