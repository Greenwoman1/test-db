const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class OrderItemOption extends Model {


  static associateModel(models) {
    OrderItemOption.belongsTo(models.OrderItem);
    OrderItemOption.belongsTo(models.Option);



  }


  static initModel() {
    OrderItemOption.init(
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
        modelName: 'OrderItemOption',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItemOption;
