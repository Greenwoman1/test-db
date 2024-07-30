const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Option extends Model {
  static associateModel(models) {
    // Option.belongsToMany(models.OrderItems, { through: 'ProductO' });
    Option.belongsTo(models.GroupOptions);
    Option.hasMany(models.OrderItemOptions);
    Option.belongsToMany(models.OrderItems, { through: 'OIO' });
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
