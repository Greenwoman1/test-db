const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
const Order = require('../Order/Order');

class OrderItem extends Model {
  static associateModel(models) {
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.VariantLocation);
    OrderItem.hasMany(models.OrderItemOption);
    OrderItem.hasMany(models.OrderItemTopons);
    OrderItem.hasMany(models.OrderItemIngredient);
  }

  static initModel() {
    OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        ProductId: {
          type: DataTypes.UUID,
          allowNull: false,
          
        },
      },
      {
        sequelize,
        modelName: 'OrderItem',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }
}

module.exports = OrderItem;
