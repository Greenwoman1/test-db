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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'user'
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          
        },
        shippingAddress: {
          type: DataTypes.STRING
        },
        /// posebna tabela

      
        
        /// id paymenta 

        /// payment tabela: method, userId, primary, active 

        

      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
        hooks: {
          beforeCreate: async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
          },
          beforeBulkCreate: async (users) => {
            for (const user of users) {
              const hashedPassword = await bcrypt.hash(user.password, 10);
              user.password = hashedPassword;
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
