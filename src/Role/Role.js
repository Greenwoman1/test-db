

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Role extends Model {
  static initModel() {
    Role.init(
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
        modelName: 'Role',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    Role.belongsToMany(models.User, { through: 'UserRole' });

    Role.belongsToMany(models.Permissions, { through: 'RolePermission' });

  }
}

module.exports = Role;
