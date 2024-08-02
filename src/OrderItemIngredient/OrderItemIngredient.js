const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

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
        }
    

        

      },
      {
        sequelize,
        modelName: 'OrderItemIngredient',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItemIngredient;
