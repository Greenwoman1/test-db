const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Role extends Model {
  static initModel() {
    Role.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            len: [4, 64], // Validacija da opis bude između 4 i 64 karaktera
          },
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            len: [4, 64], // Validacija da ime bude između 4 i 64 karaktera
          },
        },
      },
      {
        sequelize,
        modelName: 'Role',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    // M:N odnos između Role i User
    Role.belongsToMany(models.User, { through: 'UserRole' });

    // M:N odnos između Role i Permissions
    Role.belongsToMany(models.Permissions, { through: 'RolePermission' });
  }
}

module.exports = Role;
