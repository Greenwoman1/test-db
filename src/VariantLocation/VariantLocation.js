const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class VariantLocation extends Model {
  static initModel() {
    VariantLocation.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
          allowNull: false,
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'VariantLocation',
        timestamps: true,
        createdAt: true,  // Ensure you want createdAt and updatedAt fields
        updatedAt: 'updateTimestamp', // Customizing updatedAt field if necessary
      }
    );
  }

  static associateModel(models) {


    VariantLocation.hasOne(models.VariantSKURule, { as: 'VarLocRule', foreignKey: 'VariantLocationId' });

    VariantLocation.belongsTo(models.Location);
    VariantLocation.hasMany(models.LinkedVariant, { as: 'LinkVarLoc', foreignKey: 'VariantLocationId' });



    VariantLocation.belongsTo(models.Variant, { as: 'VarLoc', foreignKey: 'VariantId' });


    VariantLocation.hasMany(models.GroupTopon)
    VariantLocation.hasMany(models.GroupOptions)
    VariantLocation.hasMany(models.VariantIngredient, { as: 'VarLocIng', foreignKey: 'VariantLocationId' })

  }
}

module.exports = VariantLocation;
