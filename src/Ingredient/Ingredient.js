const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Ingredient extends Model {
  static associateModel(models) {
    Ingredient.hasMany(models.IngredientLocation, { as: 'InLoc', foreignKey: 'IngredientId' });
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
          validate: {
            notNull: {
              msg: 'Name is required'
            },
            len: {
              args: [3, 255],
              msg: 'Name must be between 3 and 255 characters long'
            }
          }
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
