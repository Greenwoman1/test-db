const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

    
class Variant extends Model {
   

    static associateModel(models) {
        Variant.hasOne(models.SKURule);
        Variant.belongsTo(models.Product);
        Variant.belongsToMany(models.Topons, { through: 'VariantTopons' });
        Variant.hasMany(models.GroupOption);
        Variant.belongsToMany(models.Location, { through: 'VariantLocation' });
    }


    static initModel() {
        Variant.init(
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
            },
            {
                sequelize,
                modelName: 'Variant',
                timestamps: true,
                createdAt: false,
                updatedAt: 'updateTimestamp',
            }
        );
    }
}

module.exports = Variant;
