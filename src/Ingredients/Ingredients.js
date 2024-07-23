const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Ingredients extends Model {


  static associateModel(models) {
    Ingredients.hasMany(models.IngredientLocations, { as : 'IL', foreignKey: 'IngredientId' });
  }
  static initModel() {
    Ingredients.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },


      },
      {
        sequelize,
        modelName: 'Ingredients',
        timestamps: true,
        createdAt: false,
      }
    );
  }



}

module.exports = Ingredients;
