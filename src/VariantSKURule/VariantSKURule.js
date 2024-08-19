const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

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
          validate: {
            min: 0,  // Ensures quantity is non-negative
          },
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,  // Default value for 'disabled'
        },
      },
      {
        sequelize,
        modelName: 'VariantSKURule',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }

  static associateModel(models) {
    VariantSKURule.belongsTo(models.SKU, { as: 'VSKU', foreignKey: 'SKUId' });
    VariantSKURule.belongsTo(models.VariantLocation, { as: 'VarLocRule', foreignKey: 'VariantLocationId' });
  }
}

module.exports = VariantSKURule;
