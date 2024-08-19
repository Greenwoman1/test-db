const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../clients/sequelize');
const client = require('../../clients/elastics');

class Product extends Model {
  static associateModel(models) {
    Product.hasMany(models.Variant);
    Product.belongsTo(models.Category);
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
            len: [4, 64], 
          },
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        hooks: {
          afterCreate: async (product) => {
            // Funkcija za preuzimanje detalja proizvoda
            const fetchProductDetails = async (productId) => {
              return await Product.findByPk(productId, {
                attributes: ['id', 'name', 'description', 'type'],
              });
            };

            // Funkcija za indeksiranje dokumenta u Elasticsearch
            const indexDocumentInElastic = async (index, id, body) => {
              await client.index({
                index,
                id,
                document: { ...body },
              });
            };

            // Preuzimanje i indeksiranje podataka proizvoda
            const productData = await fetchProductDetails(product.id);
            await indexDocumentInElastic('products', product.id, productData);
          },
        },
      }
    );
  }
}

module.exports = Product;
