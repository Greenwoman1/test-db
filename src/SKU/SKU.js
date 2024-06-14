const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class SKU extends Model {
    static associateModel(models) {
        SKU.belongsTo(models.SKURule);
    }

    static initModel() {
        SKU.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                stock: {
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
                modelName: 'SKU',
                timestamps: true,
                createdAt: false,
            },
        );
    }
}

module.exports = SKU;
