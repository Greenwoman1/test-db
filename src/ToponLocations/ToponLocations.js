const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ToponLocations extends Model {
  static initModel() {
    ToponLocations.init(
      {},
      {
        sequelize,
        modelName: 'ToponLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = ToponLocations;
