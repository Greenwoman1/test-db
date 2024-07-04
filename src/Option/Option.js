const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Option extends Model {
  static associateModel(models) {
    // Option.belongsTo(models.Variant, { through: 'GroupOptions' });
    Option.belongsToMany(models.OrderItems, { through: 'ProductO' });
  }

  static initModel() {
    Option.init(
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
        }
      },
      {
        sequelize,
        modelName: 'Option',
        timestamps: true,
        createdAt: false,
      },
    );
  }
}

module.exports = Option;
