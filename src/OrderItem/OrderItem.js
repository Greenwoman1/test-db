const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Order = require('../Order/Order');

class OrderItem extends Model {


  static associateModel(models) {
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.VariantLocation);
    // OrderItem.belongsToMany(models.GroupToponsMid, { through: 'OrderItemTopons', as: 'OIT' });
    // OrderItem.belongsToMany(models.Option, { through: 'OrderItemOption', as : 'OIO' });
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
