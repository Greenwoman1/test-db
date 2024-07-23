const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const PriceHistory = require('../PriceHistory/PriceHistory');
const { Op } = require('sequelize');

class Product extends Model {
  static associateModel(model) {
    Product.hasMany(model.Variant, { as: 'Variants' });

    Product.belongsToMany(model.Variant, {
      through: 'ComboVariants',
      as: 'comboVariants',
      foreignKey: 'ProductId',

    });



  }

  static initModel() {
    Product.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING(64),
          validate: {
            min: 4
          },
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',

      },
    );




  }


  async getPrice(date) {

    try {
      const price = await PriceHistory.findOne({
        where: {
          itemId: this.id,
          createdAt: {
            [Op.lte]: date
          }
        },
        order: [['createdAt', 'DESC']]
      });
      return price ? price.price : 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }
}

module.exports = Product;
