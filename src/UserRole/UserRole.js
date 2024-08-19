

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class UserRole extends Model {
  static initModel() {
    UserRole.init(
      {
  
      },
      {
        sequelize,
        modelName: 'UserRole',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
   

  }
}

module.exports = UserRole;
