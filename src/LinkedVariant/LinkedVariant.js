const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

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
          defaultValue: 1,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Quantity is required',
            },
            isInt: {
              msg: 'Quantity must be an integer',
            },
            min: {
              args: [1],
              msg: 'Quantity must be at least 1',
            },
          },
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
    LinkedVariant.belongsTo(models.VariantLocation, {as : 'LinkVarLoc', foreignKey: 'VariantLocationId'});
    LinkedVariant.belongsTo(models.Variant, { foreignKey: 'VariantId', as : 'LinkVar' });



  }
}

module.exports = LinkedVariant;
