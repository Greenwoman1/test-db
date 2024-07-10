const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Order extends Model {


  static associateModel(models) {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItems);
    Order.hasMany(models.OrderItemsCombo);

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
            min: 4
          },
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
        },

        LocationId: {
          type: DataTypes.UUID,
          allowNull: false,
        }
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
