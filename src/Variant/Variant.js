const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');
const PriceHistory = require('../PriceHistory/PriceHistory');

class Variant extends Model {


  static associateModel(models) {

    Variant.belongsToMany(models.ComboItems, { through: 'ComboVariants' });
    Variant.belongsTo(models.Product);
    Variant.hasMany(models.PriceHistory);
    Variant.hasMany(models.GroupOptions);
    Variant.hasMany(models.GroupTopons);
    Variant.belongsToMany(models.Location, { through: 'VariantLocation' });

  }


  static initModel() {
    Variant.init(
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
        }

      },
      {
        sequelize,
        modelName: 'Variant',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
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
      return price ? price.price : null;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }
}

module.exports = Variant;
