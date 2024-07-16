const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const PriceHistory = require('../PriceHistory/PriceHistory');
const { Op } = require('sequelize');

class Topons extends Model {


  static associateModel(models) {
    Topons.belongsToMany(models.GroupTopons, { through: 'GroupToponsMid' });
    Topons.belongsToMany(models.OrderItems, { through: 'ProductT' });
    Topons.hasMany(models.PriceHistory, { foreignKey: 'itemId', constraints: false });
    Topons.belongsToMany(models.SKU, { through: 'ToponSKUs' });


  }
  static initModel() {
    Topons.init(
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
        minValue: {
          type: DataTypes.INTEGER,
        },
        maxValue: {
          type: DataTypes.INTEGER,
        },
        defaultValue: {
          type: DataTypes.INTEGER,
        },

      },
      {
        sequelize,
        modelName: 'Topons',
        timestamps: true,
        createdAt: false,
      }
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

module.exports = Topons;
