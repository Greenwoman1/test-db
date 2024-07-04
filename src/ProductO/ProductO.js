const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ProductO extends Model {


  static associateModel(models) {



  }


  static initModel() {
    ProductO.init(
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
        modelName: 'ProductO',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }


}

module.exports = ProductO;
