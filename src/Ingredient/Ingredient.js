const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Ingredient extends Model {


  static associateModel(models) {
    Ingredient.hasMany(models.IngredientLocation, { as : 'InLoc', foreignKey: 'IngredientId' });
  }
  static initModel() {
    Ingredient.init(
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
        modelName: 'Ingredient',
        timestamps: true,
        createdAt: false,
      }
    );
  }



}

module.exports = Ingredient;
