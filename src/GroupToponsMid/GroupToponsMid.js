const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class GroupToponsMid extends Model {
  static initModel() {
    GroupToponsMid.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4

        },
        rules: {
          type: DataTypes.JSON
        }
      },
      {
        sequelize,
        modelName: 'GroupToponsMid',
        freezeTableName: true,

        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    // GroupToponsMid.hasMany(00);

  }
}

module.exports = GroupToponsMid;
