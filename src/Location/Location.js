const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Location extends Model {
  static initModel() {
    Location.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        name: {
          type: DataTypes.STRING(64),
          validate: {
            notEmpty: true,
            min: 8,
          }
        }
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
