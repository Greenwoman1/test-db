const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class SKURule extends Model {
    static initModel() {
        SKURule.init(
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
                modelName: 'SKURule',
                timestamps: true,
                createdAt: false,
            }
        );
    }

    static associateModel(models) {
        SKURule.hasOne(models.SKU);
        
    }
}

module.exports = SKURule;
