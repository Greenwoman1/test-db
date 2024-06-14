const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ProductVariant extends Model {
    static associateModel(models) {
    
    }

    static initModel() {
        ProductVariant.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                }
            },
            {
                sequelize,
                modelName: 'ProductVariant',
                timestamps: true,
            },
        );
    }
}

module.exports = ProductVariant;
