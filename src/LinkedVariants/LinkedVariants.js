const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class LinkedVariants extends Model {
  static initModel() {
    LinkedVariants.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        }

      },

      {
        sequelize,
        modelName: 'LinkedVariants',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    LinkedVariants.belongsTo(models.VariantLocations);
    LinkedVariants.belongsTo(models.Variant, { foreignKey: 'VariantId', as : 'LinkVar' });



  }
}

module.exports = LinkedVariants;
