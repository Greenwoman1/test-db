const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class WarehouseLocations extends Model {
  static initModel() {
    WarehouseLocations.init(
      {

      },

      {
        sequelize,
        modelName: 'WarehouseLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {




  }
}

module.exports = WarehouseLocations;
