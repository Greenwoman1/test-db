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


    VariantLocations.hasOne(models.VariantSKURule, { as: 'VL_Rule', foreignKey: 'VariantLocationId' });

    VariantLocations.belongsTo(models.Location);
    VariantLocations.hasMany(models.LinkedVariants, { as: 'LinkVar', foreignKey: 'VariantLocationId' });



    VariantLocations.belongsTo(models.Variant, { as: 'VL', foreignKey: 'VariantId' });


    VariantLocations.hasMany(models.GroupTopon)
    VariantLocations.hasMany(models.GroupOptions)
    VariantLocations.hasMany(models.VariantIngredients, { as : 'VL_VI', foreignKey: 'VariantLocationId' })

  }
}

module.exports = VariantLocations;
