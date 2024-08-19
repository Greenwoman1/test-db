const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
const { Op } = require('sequelize');

class Topon extends Model {


  static associateModel(models) {
    Topon.hasMany(models.ToponPrice);
    Topon.belongsToMany(models.Location, { through: 'ToponLocation' });
    Topon.hasMany(models.ToponLocation, { as: 'TopLoc' , foreignKey: 'ToponId' });



  }
  static initModel() {
    Topon.init(
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
        modelName: 'Topon',
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

module.exports = Topon;
