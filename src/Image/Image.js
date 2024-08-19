const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');

class Image extends Model {
    static initModel() {
        Image.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(64),
                    validate: {
                        notEmpty: true,
                        min: 8,
                    }
                },
                image: {
                    type: DataTypes.STRING(256),
                    validate: {
                        notEmpty: true,
                        min: 8,
                    }
                }
            },
            {
                sequelize,
                modelName: 'Image',
                timestamps: true,
            }
        );
    }

    static associateModel(models) {
        Image.belongsTo(models.Variant);

    }
}

module.exports = Image;
