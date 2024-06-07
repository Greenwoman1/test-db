const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class Category extends Model {}

Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
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