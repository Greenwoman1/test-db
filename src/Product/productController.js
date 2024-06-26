const sequelize = require('../../sequelize');
const { Variant, Topons, GroupOption, Option, GroupRule, Product, Location } = require('../index');

const { createProduct,
  handleComboItems,
  handleVariants,
  updateOrCreateProduct,
  updateOrCreateVariant,
  updateOrCreateGroupOption,
  updateOrCreateTopon,
  updateComboItems

} = require('./utils/index');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(401).json({ message: 'Product not found' });
      return 
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(401).json({ message: 'Product not found' });
      return
    }
    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const saveProductFromJson = async (req, res) => {
  const productJson = req.body;

  let errors = [];
  try {
    const result = await sequelize.transaction(async (t) => {
      const productName = productJson.name;
      const productItems = productJson.items || [];
      
      const promises = [
        Product.findOne({ where: { name: productName } }),
        Product.findAll({ where: { id: productItems } }),
        Topons.findAll()
      ];

      const [existingProduct, existingProductItems, existingTopons] = await Promise.all(promises);

      if (existingProduct) {
        errors.push({ msg: `Product with name (${productName}) already exists`, param: 'name', location: 'body' });
      }

      if (existingProductItems.length !== productItems.length) {
        const missingProductItems = productItems.filter(id => !existingProductItems.map(product => product.id).includes(id));
        if (missingProductItems.length > 0) {
          errors.push({ msg: `Products with ids (${missingProductItems.join(', ')}) do not exist`, param: 'items', location: 'body' });
        }
      }

      if (productJson.type !== 'combo') {
        for (const variant of productJson.variants) {
          const toponIds = variant.topons.map(topon => topon.toponId);
          const existingToponIds = existingTopons.map(topon => topon.id);
          const missingTopons = toponIds.filter(id => !existingToponIds.includes(id));
          if (missingTopons.length > 0) {
            errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
          }
        }
      }

      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
        return;
      }

      const product = await createProduct(productJson, t);

      if (productJson.type === 'combo') {
        await handleComboItems(product, productJson.items, productJson.locationIds, t);
      } else {
        await handleVariants(productJson.variants, product.id, t);
      }

      res.status(201).json({ message: 'Product created successfully' });
    });
  } catch (error) {
    console.error('Error during saveProductFromJson:', error);
    res.status(500).json({ message: error.message });
  }
};



const getProductSettings = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: Variant,
          include: [
            {
              model: GroupOption,
              include: [Option, GroupRule]
            },
            Topons
          ],
          as: 'Variants'
        },

      ]
    });

    if (!product) {
      return res.status(401).json({ message: `Product "${productId}" not found` });
    }
    const result = {
      product: {
        name: product.name,
        description: product.description,
        type: product.type,
        variants: product.Variants.map(variant => (
          {
            name: variant.name,
            groupOptions: variant.GroupOptions.map(groupOption => ({
              name: groupOption.name,
              options: groupOption.Options.map(option => ({
                name: option.name
              })),

              rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
                name: rule.name,
                description: rule.description,
                ruleType: rule.ruleType,
                ruleValue: rule.ruleValue
              })) : []
            })),
            topons: variant.Topons.map(topon => ({
              name: topon.name,
              minValue: topon.minValue,
              maxValue: topon.maxValue,
              defaultValue: topon.defaultValue
            }))
          }))
      }
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error during getProductSettings:', error);
    res.status(500).json({ message: error.message });
  }

};
const formatProductResponse = (product) => {
  const formattedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    type: product.type,
  };

  if (product.comboItems) {
    formattedProduct.comboItems = product.comboItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      variants: item.Variants ? item.Variants.map(variant => ({
        name: variant.name,
        groupOptions: variant.GroupOptions ? variant.GroupOptions.map(groupOption => ({
          name: groupOption.name,
          options: groupOption.Options ? groupOption.Options.map(option => ({
            name: option.name,
          })) : [],
          rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
            name: rule.name,
            description: rule.description,
            ruleType: rule.ruleType,
            ruleValue: rule.ruleValue,
          })) : [],
        })) : [],
        topons: variant.Topons ? variant.Topons.map(topon => ({
          name: topon.name,
          minValue: topon.minValue,
          maxValue: topon.maxValue,
          defaultValue: topon.defaultValue,
          
        })) : []
      })) : []
    }));
  }

  return formattedProduct;
};

const getProductSettingsCombo = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: Product,
          as: 'comboItems',
          through: { attributes: [] },
          include: [
            {
              model: Variant,
              include: [
                {
                  model: GroupOption,
                  include: [Option, GroupRule]
                },
                Topons
              ],
              as: 'Variants'
            }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const formattedProduct = formatProductResponse(product);

    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error('Error during getProductSettingsCombo:', error);
    res.status(500).json({ message: error.message });
  }
};
const updateProductFromJson = async (req, res, next) => {
  try {
    const productJson = req.body;
    const errors = [];
    let product;
    await sequelize.transaction(async (t) => {

      product = await updateOrCreateProduct(productJson);

      const productName = productJson.name;
      const productItems = productJson.items || [];
      const toponIds = productJson.variants?.flatMap(variant => variant.topons?.map(topon => topon.toponId)) || [];
      const locationIds = productJson.locationIds || [];
      const promises = [
        Product.findOne({ where: { name: productName } }),
        Product.findAll({ where: { id: productItems } }),
        Topons.findAll({ where: { id: toponIds } }),
        Location.findAll({ where: { id: locationIds } }),
      ];

      const [existingProduct, existingProductItems, existingTopons, existingLocations] = await Promise.all(promises);

      if (existingProduct && existingProduct.id !== product.id) {
        errors.push({ msg: `Product with name ${productName} already exists`, param: 'name', location: 'body' });
      }

      if (existingProductItems.length !== productItems.length) {
        const missingProductItems = productItems.filter(id => !existingProductItems.map(product => product.id).includes(id));
        if (missingProductItems.length > 0) {
          errors.push({ msg: `Products with ids (${missingProductItems.join(', ')}) do not exist`, param: 'items', location: 'body' });
        }
      }

      if (existingLocations.length !== locationIds.length) {
        const missingLocations = locationIds.filter(id => !existingLocations.map(location => location.id).includes(id));
        if (missingLocations.length > 0) {
          errors.push({ msg: `Locations with ids (${missingLocations.join(', ')}) do not exist`, param: 'locationIds', location: 'body' });
        }
      }
      
      if (toponIds.length > 0) {
        const existingToponIds = existingTopons.map(topon => topon.id);
        const missingTopons = toponIds.filter(id => !existingToponIds.includes(id));
        if (missingTopons.length > 0) {
          errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
        }
      }
      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
      }






      if (productJson.type === 'combo') {
        await updateComboItems(product.id, productJson.items, t);
      } else {
        for (const variantData of productJson.variants) {
          const variant = await updateOrCreateVariant(variantData, product.id, t);

          for (const groupOptionData of variantData.groupOptions) {
            await updateOrCreateGroupOption(groupOptionData, variant.id, t);
          }

          for (const toponData of variantData.topons) {
            await updateOrCreateTopon(toponData, variant.id, t);
          }
        }
      }
    });

    next()  
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error('Error updating product:', error);
  }



}

const getProductsByLocation = async (req, res) => {
  const { locationId } = req.params;
  try {
    const errors = [];

    if (!locationId) {
      errors.push('Location ID is required');
    }
    const location = await Location.findByPk(locationId);
    if (!location) {
      errors.push('Location not found');
    }
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const products = await Product.findAll({
      attributes: ['id', 'name'],
      include: {
        model: Variant,
        attributes: [],
        include: {
          model: Location,
          attributes: [],
          where: { id: locationId }
        }
      }
    });

    res.status(200).json(products);
  } catch (error) {

    res.status(500).json({ error: 'An error occurred while fetching products by location' });

  }

}
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  saveProductFromJson,
  getProductSettings,
  getProductSettingsCombo,
  updateProductFromJson,
  getProductsByLocation
};
