const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna
class OrderItem extends Model {}
OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    timestamps: true,
  },
);

module.exports = { OrderItem };