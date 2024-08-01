const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

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
          allowNull: false

        },
        max: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        disabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false
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
    GroupToponsMid.hasOne(models.ToponSKURule, { as : 'GT_Rule', GroupToponMidId: 'id' });
    GroupToponsMid.belongsTo(models.GroupTopon, {as: 'TL_Group', GroupToponId: 'id'});
    GroupToponsMid.belongsTo(models.ToponLocations);
    // GroupToponsMid.belongsToMany(models.OrderItems, { through: 'OrderItemTopons', as : 'OIT' });

    GroupToponsMid.hasMany(models.OrderItemTopons);
  }
}

module.exports = GroupToponsMid;
