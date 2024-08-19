const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class WaiterBreak extends Model {
  static initModel() {
    WaiterBreak.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
        },
        description: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            len: [4, 64],  // Ensures the description length is between 4 and 64 characters
          },
        },
        status: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            isIn: [['start', 'end']],  // Validates that the status is either 'start' or 'end'
          },
        },
        time: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,  // Ensures time is non-negative
          },
        },
      },
      {
        sequelize,
        modelName: 'WaiterBreak',
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp',  // Custom name for updatedAt column
      }
    );
  }

  static associateModel(models) {
    WaiterBreak.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  }
}

module.exports = WaiterBreak;
