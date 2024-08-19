const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class GroupToponsMid extends Model {
  static initModel() {
    GroupToponsMid.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        min: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
              msg: 'Min must be an integer'
            },
            min: {
              args: [0],
              msg: 'Min cannot be less than 0'
            }
          }
        },
        max: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
              msg: 'Max must be an integer'
            },
            min: {
              args: [1],
              msg: 'Max must be at least 1'
            }
          }
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Disabled must be specified'
            }
          }
        },
        default: {
          type: DataTypes.INTEGER,
          validate: {
            isInt: {
              msg: 'Default must be an integer'
            },
            min: {
              args: [0],
              msg: 'Default cannot be less than 0'
            },
            // customValidator(value) {
            //   if (value !== null && (value <= this.min || value >= this.max)) {
            //     throw new Error('Default must be within the min and max range');
            //   }
            // }
          }
        }
      },
      {
        sequelize,
        modelName: 'GroupToponsMid',
        freezeTableName: true,
        timestamps: true,
      }
    );
  }

  static associateModel(models) {
    GroupToponsMid.hasOne(models.ToponSKURule, { as: 'TSRule', foreignKey: 'GroupToponMidId' });
    GroupToponsMid.belongsTo(models.GroupTopon, { as: 'GTop', foreignKey: 'GroupToponId' });
    GroupToponsMid.belongsTo(models.ToponLocation);
    GroupToponsMid.hasMany(models.OrderItemTopons);
  }
}

module.exports = GroupToponsMid;
