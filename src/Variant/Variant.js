const { DataTypes, Model, UUIDV4, BelongsTo } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Variant extends Model {


  static associateModel(models) {
    Variant.belongsTo(models.Product, { as: 'Product' });
    Variant.hasMany(models.GroupOptions);
    // Variant.hasMany(models.ComboVariants, { foreignKey: 'VariantId' });
    Variant.belongsToMany(models.Location, { through: 'Location' });
    Variant.hasMany(models.VariantLocations, { as: 'VL', foreignKey: 'VariantId' });
    Variant.hasMany(models.VariantIngredients);
    Variant.hasMany(models.LinkedVariants);
    Variant.hasMany(models.VariantPrice)

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
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          },
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
      return price ? price.price : 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }
}

module.exports = Variant;
