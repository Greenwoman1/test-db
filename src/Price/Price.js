const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class Price extends Model {
    static initModel() {
        Price.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: UUIDV4
                },
        
                itemId: {
                  type: DataTypes.UUID,
                  allowNull: false
                },
        
                price: {
                  type: DataTypes.DECIMAL(10, 2),
                  allowNull: false
                }

            },
            {
                sequelize,
                modelName: 'Price',
                timestamps: true,
            }
        );
    }

    static associateModel(models) {
    
      Price.belongsTo(models.Variant, { foreignKey: 'itemId', constraints: false });
      Price.belongsTo(models.Topons, { foreignKey: 'itemId', constraints: false });


    }
}

module.exports = Price;
