

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class UserPermission extends Model {
  static initModel() {
    UserPermission.init(
      {
      
      },
      {
        sequelize,
        modelName: 'UserPermission',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = UserPermission;
