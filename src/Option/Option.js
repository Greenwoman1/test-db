const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Option extends Model {
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
          validate: {
            notEmpty: {
              msg: 'Name is required and cannot be empty',
            },
            len: {
              args: [1, 255],
              msg: 'Name must be between 1 and 255 characters long',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Option',
        timestamps: true,
        createdAt: false,
        updatedAt: false,
      }
    );
  }

  static associateModel(models) {
    Option.belongsTo(models.GroupOptions);
    Option.hasMany(models.OrderItemOption);
  }
}

module.exports = Option;
