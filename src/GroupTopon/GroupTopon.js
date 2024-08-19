const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class GroupTopon extends Model {
  static initModel() {
    GroupTopon.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: UUIDV4
        },
        rules: {
          type: DataTypes.JSON,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Rules cannot be empty'
            },
            
          }
        },
      },
      {
        sequelize,
        modelName: 'GroupTopon',
        timestamps: true,
        createdAt: false,
      },
    );
  }

  static associateModel(models) {
    GroupTopon.belongsTo(models.VariantLocation);
    GroupTopon.hasMany(models.GroupToponsMid);
  }
}

module.exports = GroupTopon;
