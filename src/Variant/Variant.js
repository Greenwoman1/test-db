const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const Price = require('../Price/Price');
const { Op } = require('sequelize');
    
class Variant extends Model {
   

    static associateModel(models) {
        Variant.hasOne(models.SKURule);
        Variant.belongsTo(models.Product);
        Variant.belongsToMany(models.Topons, { through: 'VariantTopons' });
        Variant.hasMany(models.GroupOption);
        Variant.belongsToMany(models.Location, { through: 'VariantLocation' });
        Variant.hasMany(models.Image);
        Variant.hasMany(models.Price, {
            foreignKey: 'itemId',
            constraints: false,
            scope: {
                itemType: 'Variant'
            }
        });
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
                },
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
          const price = await Price.findOne({
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
