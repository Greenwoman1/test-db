const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
const { Op } = require('sequelize');
class VariantPrice extends Model {
  static initModel() {
    VariantPrice.init(
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
        modelName: 'VariantPrice',
        timestamps: true,
      }
    );
   
  }

  static associateModel(models) {
    VariantPrice.belongsTo(models.VariantLocation, {as : 'VarLocPrice', foreignKey: 'VariantLocationId'});


  }
  static async getPriceByDate(itemId, date = new Date()) {
    const price = await VariantPrice.findOne({
      where: {
        VariantLocationId: itemId,
        createdAt: {
          [Op.lte]: date
        }
      },
      order: [['createdAt', 'DESC']]
    });

    return price ? price.price : 0;
  }
}




module.exports = VariantPrice;
