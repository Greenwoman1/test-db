const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantSKUs extends Model {
  static initModel() {
    VariantSKUs.init(
      {},
      {
        sequelize,
        modelName: 'VariantSKUs',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = VariantSKUs;
