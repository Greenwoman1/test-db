const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
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
        modelName: 'Price',
        timestamps: true,
      }
    );
   
  }

  static associateModel(models) {
    VariantPrice.belongsTo(models.Variant);


  }
  static async getPriceByDate(itemId, date = new Date()) {
    const price = await VariantPrice.findOne({
      where: {
        VariantId: itemId,
        createdAt: {
          [Op.lte]: date
        }
      },
      order: [['createdAt', 'DESC']]
    });

    return price ? price.price : null;
  }
}




module.exports = VariantPrice;
