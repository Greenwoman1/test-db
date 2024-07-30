const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const bcrypt = require('bcrypt');
const User = require('../User/User');
const Payment = require('../Payment/Payment');

class UserPayment extends Model {
  static initModel() {
    UserPayment.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
      
        method: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        primary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        }
        /// id Userpaymenta 

        /// Userpayment tabela: method, UserPaymentId, primary, active 

        

      },
      {
        sequelize,
        modelName: 'UserPayment',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }

  static associateModel(models) {

    UserPayment.belongsTo(models.User);
    UserPayment.belongsTo(models.Payment);

  }
}


module.exports = UserPayment;
