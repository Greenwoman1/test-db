const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class Category extends Model { }
Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updateTimestamp',
  },
);

module.exports = Category;