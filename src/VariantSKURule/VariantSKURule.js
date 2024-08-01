const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class VariantSKURule extends Model {
  static initModel() {
    VariantSKURule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        unit: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'VariantSKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {

    VariantSKURule.belongsTo(models.SKU, { as: 'VSKU', foreignKey: 'SKUId' });
    VariantSKURule.belongsTo(models.VariantLocations, { as: 'VL_Rule', foreignKey: 'VariantLocationId' });


  }
}

module.exports = VariantSKURule;
