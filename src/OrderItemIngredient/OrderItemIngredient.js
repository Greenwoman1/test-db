const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class OrderItemIngredient extends Model {
  static associateModel(models) {
    OrderItemIngredient.belongsTo(models.OrderItem);
    OrderItemIngredient.belongsTo(models.VariantIngredient);
  }

  static initModel() {
    OrderItemIngredient.init(
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
      },
      {
        sequelize,
        modelName: 'OrderItemIngredient',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updateTimestamp',
      }
    );
  }
}

module.exports = OrderItemIngredient;
