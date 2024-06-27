const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Location extends Model {
    static initModel() {
        Location.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: UUIDV4
                },
                name: {
                    type: DataTypes.STRING(64),
                    validate: {
                        notEmpty: true,
                        min: 8,
                    }
                }
            },
            {
                sequelize,
                modelName: 'Location',
                timestamps: true,
            }
        );
    }

    static associateModel(models) {
        Location.belongsToMany(models.Variant, { through: 'VariantLocation' });
        Location.hasMany(models.SKURule);

    }
}

module.exports = Location;
