const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Warehouse extends Model {
  static initModel() {
    Warehouse.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        }
      },
      {
        sequelize,
        modelName: 'Warehouse',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    Warehouse.belongsToMany(models.Location, { through: 'WarehouseLocations' });
    Warehouse.hasMany(models.SKU);
  }
}

module.exports = Warehouse;
