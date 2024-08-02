const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { getSKUById } = require('../SKU/skuController');
const SKU = require('../SKU/SKU');

class IngredientSKURule extends Model {
  static initModel() {
    IngredientSKURule.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name : {
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
        modelName: 'IngredientSKURule',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {

    IngredientSKURule.belongsTo(models.SKU, { as : 'InSku', foreignKey: 'SKUId' });
    IngredientSKURule.belongsTo(models.VariantIngredient, { as : 'VI_Rule', foreignKey: 'VariantIngredientId' });


  }
}

module.exports = IngredientSKURule;
