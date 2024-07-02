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
        },
        itemType: {
          type: DataTypes.STRING,
          allowNull: false
        }

      },
      {
        sequelize,
        modelName: 'Price',
        timestamps: true,
      }
    );
    PriceHistory.addHook('beforeValidate', (priceHistory, options) => {
      console.log(priceHistory, options, 'beforevalidate');
      if (priceHistory.itemType === 'Variant') {
        priceHistory.set('itemId', priceHistory.itemId);
      } else if (priceHistory.itemType === 'ComboItems') {
        priceHistory.set('itemId', priceHistory.itemId);
      }
    });
  }

  static associateModel(models) {
    PriceHistory.belongsTo(models.Variant, { foreignKey: 'itemId', constraints: false, as: 'variant' });
    PriceHistory.belongsTo(models.ComboItems, { foreignKey: 'itemId', constraints: false, as: 'comboItem' });


  }
}




module.exports = PriceHistory;
