const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class OrderDetails extends Model {}
OrderDetails.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentId: {
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

module.exports = OrderDetails;
