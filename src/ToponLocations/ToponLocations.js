const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ToponLocations extends Model {
  static initModel() {
    ToponLocations.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
     

      },

      {
        sequelize,
        modelName: 'ToponLocations',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

ToponLocations.hasMany(models.GroupToponsMid);  }
}

module.exports = ToponLocations;
  