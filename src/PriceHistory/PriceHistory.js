const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class PriceHistory extends Model {
  static initModel() {
    PriceHistory.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },

        itemId: {
          type: DataTypes.UUID,
          allowNull: false
        },

        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        }

      },
      {
        sequelize,
        modelName: 'Price',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    PriceHistory.belongsTo(models.Variant);
    PriceHistory.belongsTo(models.ComboItems);


  }
}

module.exports = PriceHistory;
