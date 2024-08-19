const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class OrderItemTopons extends Model {
  static associateModel(models) {
    OrderItemTopons.belongsTo(models.OrderItem);
    OrderItemTopons.belongsTo(models.GroupToponsMid);
  }

  static initModel() {
    OrderItemTopons.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
          validate: {
            isInt: {
              msg: 'Quantity must be an integer',
            },
            min: {
              args: [1],
              msg: 'Quantity must be at least 1',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'OrderItemTopons',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }
}

module.exports = OrderItemTopons;
