const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const PriceHistory = require('../PriceHistory/PriceHistory');
const { Op } = require('sequelize');

class Ingredients extends Model {


  static associateModel(models) {
    Ingredients.belongsToMany(models.Variant, { through: 'VariantIngredients' });

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
