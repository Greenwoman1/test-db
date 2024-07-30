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

    ToponLocations.hasMany(models.GroupToponsMid);
    ToponLocations.belongsTo(models.Topons, { as: 'TL', foreignKey: 'ToponId' });
    ToponLocations.belongsTo(models.Location);
    ToponLocations.hasMany(models.OrderItemTopons);
    ToponLocations.belongsToMany(models.OrderItems, { through: 'OIT' });
  }
}

module.exports = ToponLocations;
 