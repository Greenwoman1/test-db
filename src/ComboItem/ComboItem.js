const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboItem extends Model {
    static initModel() {
        ComboItem.init(
            {
            },
            {
                sequelize,
                modelName: 'ComboItem',
                timestamps: true,
            }
        );
    }

    static associateModel(models) {
        // ComboItem.belongsTo(models.Combo);
        // ComboItem.belongsToMany(models.Product, { through: 'ComboItemProduct' });
    }
}

module.exports = ComboItem;
