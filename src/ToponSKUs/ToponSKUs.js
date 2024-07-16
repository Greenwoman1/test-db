const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ToponSKUs extends Model {
  static initModel() {
    ToponSKUs.init(
      {},
      {
        sequelize,
        modelName: 'ToponSKUs',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = ToponSKUs;
