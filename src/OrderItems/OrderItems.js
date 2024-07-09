const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

class OrderItems extends Model {


  static associateModel(models) {
    OrderItems.belongsTo(models.Order);
    OrderItems.belongsTo(models.Variant);
    OrderItems.belongsToMany(models.Topons, { through: 'ProductT' });
    OrderItems.belongsToMany(models.Option, { through: 'ProductO' });
    OrderItems.hasMany(models.OrderItemsCombo);





  }


  static initModel() {
    OrderItems.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
        },

      },
      {
        sequelize,
        modelName: 'OrderItems',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = OrderItems;
