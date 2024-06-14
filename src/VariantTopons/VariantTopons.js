const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantTopons extends Model {
    static initModel() {
        VariantTopons.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'VariantTopons',
                timestamps: true,
            }
        );
    }

    static associateModel() {
    }
}

module.exports = VariantTopons;
