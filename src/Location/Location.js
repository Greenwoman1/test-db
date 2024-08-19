const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Location extends Model {
  static initModel() {
    Location.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Name is required and cannot be empty',
            },
            len: {
              args: [4, 64],
              msg: 'Name must be between 8 and 64 characters long',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Location',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    Location.belongsToMany(models.User, { through: 'UserLocation' });
    Location.belongsToMany(models.Variant, { through: 'VariantLocation' });
    Location.belongsToMany(models.Warehouse, { through: 'WarehouseLocation' });
    Location.hasMany(models.VariantLocation, { as: 'VarLoc', foreignKey: 'LocationId' });
    Location.belongsToMany(models.Topon, { through: 'ToponLocation' });
    Location.belongsToMany(models.Ingredient, { through: 'IngredientLocation' });
  }
}

module.exports = Location;
