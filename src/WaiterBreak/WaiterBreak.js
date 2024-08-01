

const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class WaiterBreak extends Model {
  static initModel() {
    WaiterBreak.init(
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
        time : {
          type: DataTypes.INTEGER,
          allowNull: false,

        }
      },
      {
        sequelize,
        modelName: 'WaiterBreak',
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    

    WaiterBreak.belongsTo(models.User);
  }
}

module.exports = WaiterBreak;
