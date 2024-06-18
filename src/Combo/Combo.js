const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');


class Combo extends Model {
  static initModel() {
    Combo.init(
      {
        id : {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Combo',
        timestamps: true,
        
      }
    );
  }

  static associateModel(models) {
    // Combo.belongsTo(models.Product);
    // Combo.hasMany(models.ComboItem);
  }
}


module.exports = Combo;
