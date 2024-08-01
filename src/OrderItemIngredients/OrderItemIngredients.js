const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

class OrderItemIngredients extends Model {


  static associateModel(models) {


    OrderItemIngredients.belongsTo(models.OrderItems);

    OrderItemIngredients.belongsTo(models.VariantIngredients);



  }


  static initModel() {
    OrderItemIngredients.init(
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
        modelName: 'OrderItemIngredients',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItemIngredients;
