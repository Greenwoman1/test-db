const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

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
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Name is required'
            },
            len: {
              args: [2, 64],
              msg: 'Name must be between 2 and 64 characters long'
            }
          }
        },
        unit: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Unit is required'
            },
            len: {
              args: [1, 64],
              msg: 'Unit must be between 1 and 64 characters long'
            }
          }
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Quantity is required'
            },
            isInt: {
              msg: 'Quantity must be an integer'
            },
            min: {
              args: [1],
              msg: 'Quantity must be at least 1'
            }
          }
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Disabled status is required'
            }
          }
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
    IngredientSKURule.belongsTo(models.SKU, { as: 'InSku', foreignKey: 'SKUId' });
    IngredientSKURule.belongsTo(models.VariantIngredient, { as: 'VarIngRule', foreignKey: 'VariantIngredientId' });
  }
}

module.exports = IngredientSKURule;
