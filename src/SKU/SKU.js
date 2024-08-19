const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class SKU extends Model {
  static associateModel(models) {
    SKU.hasMany(models.VariantSKURule, { as: 'VSKU', foreignKey: 'SKUId' });
    SKU.hasMany(models.IngredientSKURule, { as: 'IKU', foreignKey: 'SKUId' });
    SKU.belongsToMany(models.Topon, { through: 'ToponSKUs', foreignKey: 'SKUId' });
    SKU.belongsToMany(models.Variant, { through: 'VariantSKUs', foreignKey: 'SKUId' });
    SKU.belongsTo(models.Warehouse, { foreignKey: 'WarehouseId' });
    SKU.hasMany(models.ToponSKURule, { as: 'TSKU', foreignKey: 'SKUId' }); // Ovaj alias može biti dodeljen samo jednom
  }

  static initModel() {
    SKU.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [1, 255], 
          },
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        allowMinus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'SKU',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp', 
      }
    );
  }
}

module.exports = SKU;
