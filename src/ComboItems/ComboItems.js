const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboItems extends Model {
  static initModel() {
    ComboItems.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },
      },
      {
        sequelize,
        modelName: 'ComboItems',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    ComboItems.belongsTo(models.Combo)


  }
}

module.exports = ComboItems;
