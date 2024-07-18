const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class SKU extends Model {
  static associateModel(models) {

    SKU.hasMany(models.SKURule);
    SKU.belongsToMany(models.Topons, { through: 'ToponSKUs', foreignKey: 'SkuId' });
    SKU.belongsToMany(models.Variant, { through: 'VariantSKUs', foreignKey: 'SkuId' });
    SKU.belongsTo(models.Warehouse);
    SKU.hasMany(models.ToponSKURule);
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
          type: DataTypes.STRING,
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
