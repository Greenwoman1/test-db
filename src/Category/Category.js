const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Category extends Model {
  static initModel() {
    Category.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name cannot be empty'
          },
          len: {
            args: [1, 255],
            msg: 'Name must be between 1 and 255 characters'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Category',
      timestamps: false
    });
  }

  static associateModel(models) {
    Category.hasMany(models.Product);
    Category.hasMany(models.Category, { as: 'SubCategories', foreignKey: 'ParentId' });
  }
}

module.exports = Category;
