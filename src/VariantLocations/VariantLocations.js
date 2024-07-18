const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantLocations extends Model {
  static initModel() {
    VariantLocations.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },

      },

      {
        sequelize,
        modelName: 'VariantLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {


    VariantLocations.hasOne(models.SKURule);

    VariantLocations.hasMany(models.VariantIngredients);
    VariantLocations.belongsTo(models.Location);

    VariantLocations.hasMany(models.GroupTopon)
    VariantLocations.belongsTo(models.Variant, { as: 'Variant' });
  }
}

module.exports = VariantLocations;
