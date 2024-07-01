const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Combo extends Model {
  static initModel() {
    Combo.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },
        name: {
          type: DataTypes.STRING
        }

      },
      {
        sequelize,
        modelName: 'Combo',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

    // Combo.belongsToMany(models.Variant, { through: 'ComboVariants' });
    Combo.hasMany(models.ComboItems);
  }
}

module.exports = Combo;
