const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Location extends Model {
    static initModel() {
        Location.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(length = 100),
                    validate: {
                        notEmpty: true,
                        len: [1, 100]
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
