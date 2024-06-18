const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');

class ComboItemProduct extends Model {
    static initModel() {
        ComboItemProduct.init(
            {
               
                
            },
            {
                sequelize,
                modelName: 'ComboItemProduct',
                timestamps: true,
            }
        );
    }

    static associateModel() {
    }
}

module.exports = ComboItemProduct;
