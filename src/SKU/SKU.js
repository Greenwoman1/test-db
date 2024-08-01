const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class SKU extends Model {
  static associateModel(models) {

    SKU.hasMany(models.VariantSKURule, { as: 'VSKU', foreignKey: 'SKUId' });
    SKU.hasMany(models.IngredientSKURule, { as: 'IKU', foreignKey: 'SKUId' });
    SKU.belongsToMany(models.Topons, { through: 'ToponSKUs', foreignKey: 'SKUId' });
    SKU.belongsToMany(models.Variant, { through: 'VariantSKUs', foreignKey: 'SKUId' });
    SKU.belongsTo(models.Warehouse);
    SKU.hasMany(models.ToponSKURule, { as: 'TSKU', foreignKey: 'SKUId' });
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
      },
    );
  }
}

module.exports = SKU;
