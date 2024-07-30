const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class OrderItemOptions extends Model {


  static associateModel(models) {
    



  }


  static initModel() {
    OrderItemOptions.init(
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
        modelName: 'OrderItemOptions',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItemOptions;
