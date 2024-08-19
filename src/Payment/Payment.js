const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
const bcrypt = require('bcrypt');
const User = require('../User/User');

class Payment extends Model {
  static initModel() {
    Payment.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        }
      
  
        /// id paymenta 

        /// payment tabela: method, PaymentId, primary, active 

        

      },
      {
        sequelize,
        modelName: 'Payment',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
      }
    );
  }

  static associateModel(models) {

    Payment.hasMany(models.UserPayment);

  }
}


module.exports = Payment;
