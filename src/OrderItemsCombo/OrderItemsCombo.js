const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

class OrderItemsCombo extends Model {


  static associateModel(models) {

    OrderItemsCombo.belongsTo(models.OrderItems);
    OrderItemsCombo.belongsTo(models.Order);
    OrderItemsCombo.belongsTo(models.ComboVariants);


  }


  static initModel() {
    OrderItemsCombo.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },


      },
      {
        sequelize,
        modelName: 'OrderItemsCombo',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItemsCombo;
