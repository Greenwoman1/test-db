const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class OrderItems extends Model {


  static associateModel(models) {
    OrderItems.belongsTo(models.Order);
    OrderItems.belongsTo(models.Variant);
    OrderItems.belongsToMany(models.Topons, { through: 'ProductT' });
    OrderItems.belongsToMany(models.Option, { through: 'ProductO' });



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
        }

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
