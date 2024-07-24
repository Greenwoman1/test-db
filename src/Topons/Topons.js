const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Topons extends Model {


  static associateModel(models) {
    // Topons.belongsToMany(models.OrderItems, { through: 'ProductT' });
    Topons.hasMany(models.ToponPrice);
    Topons.belongsToMany(models.Location, { through: 'ToponLocations' });
    Topons.hasMany(models.ToponLocations, { as: 'TL' , foreignKey: 'ToponId' });



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
