

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Permissions extends Model {
  static initModel() {
    Permissions.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        description: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            min: 4
          }
        }
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
