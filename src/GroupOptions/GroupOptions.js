const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class GroupOption extends Model {
  static initModel() {
    GroupOption.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(64),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Name cannot be empty'
            },
            len: {
              args: [4, 64],
              msg: 'Name must be between 4 and 64 characters'
            }
          }
        },
        rules: {
          type: DataTypes.STRING(64),
          allowNull: true,
           
        }
      },
      {
        sequelize,
        modelName: 'GroupOptions',
        timestamps: true,
        createdAt: false,
      }
    );
  }

  static associateModel(models) {
    GroupOption.belongsTo(models.VariantLocation, { as: 'GO' });
    GroupOption.hasMany(models.Option);
  }
}

module.exports = GroupOption;
