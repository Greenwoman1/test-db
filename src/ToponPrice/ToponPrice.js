const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');
class ToponPrice extends Model {
  static initModel() {
    ToponPrice.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },

        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
     

      },
      {
        sequelize,
        modelName: 'ToponPrice',
        timestamps: true,
      }
    );
   
  }

  static associateModel(models) {
    ToponPrice.belongsTo(models.Topon);


  }
  static async getPriceByDate(itemId, date = new Date()) {
    const price = await ToponPrice.findOne({
      where: {
        ToponId: itemId,
        createdAt: {
          [Op.lte]: date
        }
      },
      order: [['createdAt', 'DESC']]
    });

    return price ? price.price : null;
  }
}




module.exports = ToponPrice;
