

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class RolePermission extends Model {
  static initModel() {
    RolePermission.init(
      {
     
      },
      {
        sequelize,
        modelName: 'RolePermission',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {

  }
}

module.exports = RolePermission;
