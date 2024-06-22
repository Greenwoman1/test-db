const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Product extends Model {
    static associateModel(model) {
        
        Product.hasMany(model.Variant);

        Product.belongsToMany(model.Product, {
            through: 'ComboItems',
            as: 'comboItems',
            foreignKey: 'comboId',
            otherKey: 'itemId'
        });

        Product.belongsToMany(model.Product, {
            through: 'ComboItems',
            as: 'itemCombos',
            foreignKey: 'itemId',
            otherKey: 'comboId'
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
                    type: DataTypes.STRING(16),
                    validate: {
                        min: 4
                    },
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                type: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                }
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
