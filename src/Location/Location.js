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
    Location.belongsToMany(models.Variant, { through: 'VariantLocations' });
    Location.belongsToMany(models.Warehouse, { through: 'WarehouseLocations' });
    Location.hasMany(models.VariantLocations, { as: 'VL', foreignKey: 'LocationId' });
    Location.belongsToMany(models.Topons, { through: 'ToponLocations' });
    Location.belongsToMany(models.Ingredients, { through: 'IngredientLocations' });

  }
}

module.exports = Location;
