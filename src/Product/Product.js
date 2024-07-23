const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

class Product extends Model {
  static associateModel(model) {
    Product.hasMany(model.Variant, { as: 'Variants' });

    Product.belongsToMany(model.Variant, {
      through: 'ComboVariants',
      as: 'comboVariants',
      foreignKey: 'ProductId',

    });



  }

  static initModel() {
    Product.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING(64),
          validate: {
            min: 4
          },
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },

      },
      {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',

      },
    );




  }


}

module.exports = Product;
