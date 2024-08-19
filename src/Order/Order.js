const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Order extends Model {
  static associateModel(models) {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem);
    Order.belongsTo(models.Location);
  }

  static initModel() {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Status cannot be empty',
            },
            len: {
              args: [4, 64],
              msg: 'Status must be between 4 and 64 characters long',
            },
          },
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true, 
          validate: {
            isDecimal: {
              msg: 'Total Price must be a valid decimal number',
            },
            min: {
              args: [0],
              msg: 'Total Price must be greater than or equal to 0',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Order',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp', 
      }
    );
  }
}

module.exports = Order;
