const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantLocation extends Model {
  static initModel() {
    VariantLocation.init(
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
        modelName: 'VariantLocation',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {


    VariantLocation.hasOne(models.VariantSKURule, { as: 'VL_Rule', foreignKey: 'VariantLocationId' });

    VariantLocation.belongsTo(models.Location);
    VariantLocation.hasMany(models.LinkedVariant, { as : 'VL_LV', foreignKey: 'VariantLocationId' });



    VariantLocation.belongsTo(models.Variant, { as: 'VL', foreignKey: 'VariantId' });


    VariantLocation.hasMany(models.GroupTopon)
    VariantLocation.hasMany(models.GroupOptions)
    VariantLocation.hasMany(models.VariantIngredient, { as : 'VL_VI', foreignKey: 'VariantLocationId' })

  }
}

module.exports = VariantLocation;
