const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');

class SKURule extends Model {
  static initModel() {
    SKURule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'SKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {
    SKURule.hasOne(models.SKU);
    SKURule.belongsTo(models.Location);

  }
}

module.exports = SKURule;
