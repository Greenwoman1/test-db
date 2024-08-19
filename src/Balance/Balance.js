const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Balance extends Model {
  static initModel() {
    Balance.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Date is required'
            },
            isDate: {
              msg: 'Must be a valid date'
            }
          }
        },
        reason: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Reason is required'
            },
            notEmpty: {
              msg: 'Reason cannot be empty'
            },
            len: {
              args: [1, 255],
              msg: 'Reason must be between 1 and 255 characters'
            }
          }
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Amount is required'
            },
            isDecimal: {
              msg: 'Amount must be a decimal value'
            },
            min: {
              args: [0],
              msg: 'Amount must be a positive number'
            }
          }
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
          validate: {
            len: {
              args: [0, 1000],
              msg: 'Comment can be up to 1000 characters long'
            }
          }
        },
        refid: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            len: {
              args: [0, 255],
              msg: 'Reference ID can be up to 255 characters long'
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'Balance',
        timestamps: true
      }
    );
  }

  static associateModel(models) {
    Balance.belongsTo(models.User);
  }
}

module.exports = Balance;
