const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Topons extends Model {


  static associateModel(models) {
    Topons.belongsToMany(models.GroupTopons, { through: 'GroupToponsMid' });
    Topons.hasOne(models.SKURule)
    Topons.belongsToMany(models.OrderItems, { through: 'ProductT' });
    Topons.hasMany(models.PriceHistory, { foreignKey: 'itemId', constraints: false });


  }
  static initModel() {
    Topons.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        minValue: {
          type: DataTypes.INTEGER,
        },
        maxValue: {
          type: DataTypes.INTEGER,
        },
        defaultValue: {
          type: DataTypes.INTEGER,
        },

      },
      {
        sequelize,
        modelName: 'Topons',
        timestamps: true,
        createdAt: false,
      }
    );
  }

}

module.exports = Topons;
