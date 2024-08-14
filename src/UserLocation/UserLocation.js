const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const bcrypt = require('bcrypt');

class UserLocation
  extends Model {
  static initModel() {
    UserLocation
      .init(
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          department: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          office: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'UserLocation',
          timestamps: true,
          createdAt: false,
          updatedAt: 'updateTimestamp',
        }
      );
  }

  static associateModel(models) {
    UserLocation.belongsTo(models.User);
    UserLocation.belongsTo(models.Location);
  }

}


module.exports = UserLocation

