const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboVariants extends Model {
  static initModel() {
    ComboVariants.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },
      },
      {
        sequelize,
        modelName: 'ComboVariants',
        freezeTableName: true,

        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = ComboVariants;
