const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Permissions extends Model {
  static initModel() {
    Permissions.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
        },
        description: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            len: {
              args: [4, 64],
              msg: 'Description must be between 4 and 64 characters long',
            },
          },
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            len: {
              args: [4, 64],
              msg: 'Name must be between 4 and 64 characters long',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Permissions',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    Permissions.belongsToMany(models.Role, { through: 'RolePermission' });
    Permissions.belongsToMany(models.User, { through: 'UserPermission' });
  }
}

module.exports = Permissions;
