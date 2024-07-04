const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel() {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Last name cannot be empty',
            },
          },
        },

        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }

  static associateModel(models) {
    User.hasMany(models.Order);
    User.hasMany(models.UserLocation);
  }
}

// User.beforeCreate(async (user) => {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
// });

module.exports = User;
