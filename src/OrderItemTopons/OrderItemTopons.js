const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class OrderItemTopons extends Model {


  static associateModel(models) {


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
          defaultValue: 1
        }

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
