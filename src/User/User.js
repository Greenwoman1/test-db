const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
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
          unique: true, 
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true, 
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'user',
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        shippingAddress: {
          type: DataTypes.STRING,
        },
        // Additional fields for future use
        // paymentId: { type: DataTypes.UUID }, // Example placeholder
        // paymentTable: { method: DataTypes.STRING, userId: DataTypes.UUID, primary: DataTypes.BOOLEAN, active: DataTypes.BOOLEAN }, // Example placeholder
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
        hooks: {
          beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
          },
          beforeBulkCreate: async (users) => {
            for (const user of users) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );
  }

  static associateModel(models) {
    User.hasMany(models.Order);
    User.belongsToMany(models.Location, { through: 'UserLocation' });
    User.hasMany(models.Balance);
    User.hasMany(models.UserPayment);
    User.hasMany(models.WaiterBreak);
    User.belongsToMany(models.Role, { through: 'UserRole' });
    User.belongsToMany(models.Permissions, { through: 'UserPermission' });
    User.hasOne(models.UserAdditionalInfo);
  }
}

module.exports = User;
