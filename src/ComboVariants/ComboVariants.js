const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboVariants extends Model {
  static initModel() {
    ComboVariants.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },

      },
      {
        sequelize,
        modelName: 'ComboVariants',

        timestamps: true,
      }
    );
  }

  static associateModel(models) {

    ComboVariants.belongsTo(models.PriceHistory, { foreignKey: 'itemId', as: 'ComboPrice', constraints: false });
    ComboVariants.hasMany(models.OrderItemsCombo);
    ComboVariants.belongsTo(models.Variant, { foreignKey: 'VariantId' });


  }
}

module.exports = ComboVariants;
