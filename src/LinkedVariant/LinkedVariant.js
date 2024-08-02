const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class LinkedVariant extends Model {
  static initModel() {
    LinkedVariant.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1
        },
        

      },

      {
        sequelize,
        modelName: 'LinkedVariant',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    LinkedVariant.belongsTo(models.VariantLocation, {as : 'VL_LV', foreignKey: 'VariantLocationId'});
    LinkedVariant.belongsTo(models.Variant, { foreignKey: 'VariantId', as : 'LinkVar' });



  }
}

module.exports = LinkedVariant;
