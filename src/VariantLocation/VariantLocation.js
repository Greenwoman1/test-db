const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class VariantLocation extends Model {
    static initModel() {
        VariantLocation.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
            },
            {
                sequelize,
                modelName: 'VariantLocation',
                timestamps: true,
            } 
        );
    }

    static associateModel(models) {
    }
}

module.exports = VariantLocation;
