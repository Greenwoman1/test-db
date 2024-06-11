const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna
const { UUIDV4 } = require('sequelize');
class CartItem extends Model { }
CartItem.init(
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
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
   
  },
  {
    sequelize,
    modelName: 'CartItem',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updateTimestamp',
  },
);

module.exports = CartItem;