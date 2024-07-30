
const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Category extends Model {
  static initModel() {
    Category.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

    },
      {
        sequelize,
        modelName: 'Category',
        timestamps: false
      }
    );
  }
  static associateModel(models) {
    Category.hasMany(models.Product)
    Category.hasMany(models.Category, { as : 'SubCategories' , foreignKey: 'ParentId' })
  }

}



module.exports = Category