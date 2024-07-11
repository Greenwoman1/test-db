const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

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
          allowNull: false
        },
        reason: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        refid: {
          type: DataTypes.STRING(255),
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
