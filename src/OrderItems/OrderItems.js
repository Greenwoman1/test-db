const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

class OrderItems extends Model {


  static associateModel(models) {
    OrderItems.belongsTo(models.Order);
    OrderItems.belongsTo(models.VariantLocations);
    OrderItems.belongsToMany(models.ToponLocations, { through: 'OrderItemTopons' });
    OrderItems.belongsToMany(models.Option, { through: 'OrderItemOptions' });





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
        ProductId: {
          type: DataTypes.UUID,
          allowNull: false,
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
