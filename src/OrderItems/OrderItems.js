const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Order extends Model {


  static associateModel(models) {
    Order.belongsTo(models.User);
    Order.belongsToMany(models.Product, { through: 'OrderItem' });

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
          type: DataTypes.STRING,
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
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
