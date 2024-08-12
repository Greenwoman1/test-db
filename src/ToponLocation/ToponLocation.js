const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ToponLocation extends Model {
  static initModel() {
    ToponLocation.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },


      },

      {
        sequelize,
        modelName: 'ToponLocation',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

    ToponLocation.hasMany(models.GroupToponsMid, { as: 'GTop', foreignKey: 'ToponLocationId' });
    ToponLocation.belongsTo(models.Topon, { as: 'TopLoc', foreignKey: 'ToponId' });
    ToponLocation.belongsTo(models.Location);
  }
}

module.exports = ToponLocation;
 