const { DataTypes, Model, UUIDV4, Op } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Variant extends Model {

  static associateModel(models) {
    Variant.belongsTo(models.Product);
    Variant.belongsToMany(models.Location, { through: 'VariantLocation' });
    Variant.hasMany(models.VariantLocation, { as: 'VarLoc', foreignKey: 'VariantId' });
    Variant.hasMany(models.LinkedVariant, { foreignKey: 'VariantId', as: 'LinkVar' });
    Variant.hasMany(models.VariantPrice, { foreignKey: 'VariantId' }); // Ensure VariantPrice has the correct foreign key
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
            len: [4, 64], // Ensure the name is between 4 and 64 characters
          },
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
      const price = await this.constructor.sequelize.models.PriceHistory.findOne({
        where: {
          itemId: this.id,
          createdAt: {
            [Op.lte]: date,
          },
        },
        order: [['createdAt', 'DESC']],
      });
      return price ? price.price : 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }
}

module.exports = Variant;
