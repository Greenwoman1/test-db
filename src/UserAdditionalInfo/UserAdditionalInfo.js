const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const bcrypt = require('bcrypt');

class UserAdditionalInfo
  extends Model {
  static initModel() {
    UserAdditionalInfo
      .init(
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
          modelName: 'UserAdditionalInfo',
          timestamps: true,
          createdAt: false,
          updatedAt: 'updateTimestamp',
        }
      );
  }

  static associateModel(models) {
    UserAdditionalInfo.belongsTo(models.User);
  }

}


module.exports = UserAdditionalInfo

