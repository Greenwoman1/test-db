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
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
     

      },

      {
        sequelize,
        modelName: 'VariantLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {


    VariantLocations.hasOne(models.VariantSKURule);

    VariantLocations.belongsTo(models.Location);
    VariantLocations.hasMany(models.LinkedVariants);

    VariantLocations.belongsTo(models.Variant, { as: 'VL', foreignKey: 'VariantId' });

    VariantLocations.hasMany(models.GroupTopon)
    VariantLocations.hasMany(models.GroupOptions)
    VariantLocations.hasMany(models.VariantIngredients)
  }
}

module.exports = VariantLocations;
