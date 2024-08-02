const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class WarehouseLocation extends Model {
  static initModel() {
    WarehouseLocation.init(
      {

      },

      {
        sequelize,
        modelName: 'WarehouseLocation',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {




  }
}

module.exports = WarehouseLocation;
