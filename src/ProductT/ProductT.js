const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ProductT extends Model {


  static associateModel(models) {


  }


  static initModel() {
    ProductT.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'ProductT',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = ProductT;
