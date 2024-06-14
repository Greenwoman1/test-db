const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantOptions extends Model {
    static initModel() {
        VariantOptions.init(
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
                modelName: 'VariantOptions',
                timestamps: true,
            }
        );
    }

    static associateModel(models) {
    }
}

module.exports = VariantOptions;
