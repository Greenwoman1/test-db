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
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          },
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


    VariantLocations.hasOne(models.VariantSKURule);

  }
}

module.exports = VariantLocations;
