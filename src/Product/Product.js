const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');
const Variant = require('../Variant/Variant');
const Category = require('../Category/Category');
const VariantLocation = require('../VariantLocation/VariantLocation');
const client = require('../../elastics');

class Product extends Model {
  static associateModel(model) {
    Product.hasMany(model.Variant);
    Product.belongsTo(model.Category);





  }

  static initModel() {
    Product.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING(64),
          validate: {
            min: 4
          },
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },


      },
      {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
        // hooks: {
        //   afterCreate: async (product) => {

        //     const fetchProductDetails = async (productId) => {
        //       const product = await Product.findByPk(productId, {

        //       });
        //       return product
        //     };
        //     const indexDocumentInElastic = async (index, id, body) => {
        //       await client.index({
        //         index,
        //         id,
        //         document: { ...body }
        //       });
        //     };


        //     const productData = await fetchProductDetails(product.id);
        //     await indexDocumentInElastic('products', product.id, productData);
        //   }
        // }
      }
    );




  }



}

module.exports = Product;
