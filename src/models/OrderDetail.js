const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class OrderDetail extends Model {}
OrderDetail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
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
    modelName: 'OrderDetails',
    timestamps: true,
  },
);

module.exports = OrderDetail;
