const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class GroupTopon extends Model {
  static associateModel(models) {

    GroupTopon.belongsTo(models.VariantLocation)
    GroupTopon.hasMany(models.GroupToponsMid)
  }

  static initModel() {
    GroupTopon.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
        },
        rules: {
          type: DataTypes.JSON

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
}

module.exports = GroupTopon;
