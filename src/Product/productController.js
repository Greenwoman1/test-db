const sequelize = require('../../sequelize');
const { Variant, Topons, GroupOption, Option, GroupRule, Product, Location, Image, VariantTopons, VariantLocation, Price } = require('../index');
const { findByPk } = require('./Product');

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

      res.status(201).json({ message: 'Product id ' + product.id + ' created' });
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
            Topons,
            Image,
            Price
          ],
          as: 'Variants'
        },

      ]
    });

    if (!product) {
      res.status(401).json({ message: `Product "${productId}" not found` });
      return
    }



    const result = {
      product: {
        name: product.name,
        description: product.description,
        type: product.type,
        variants: product.Variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          price: variant.getPrice(new Date()),
          groupOptions: variant.GroupOptions.map(groupOption => ({
            id: groupOption.id,
            name: groupOption.name,
            type: groupOption.type,
            options: groupOption.Options.map(option => ({
              id: option.id,
              name: option.name
            })),
            rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
              id: rule.id,
              name: rule.name,
              description: rule.description,
              ruleType: rule.ruleType,
              ruleValue: rule.ruleValue
            })) : []
          })),
          topons: variant.Topons.map(topon => ({
            id: topon.id,
            name: topon.name,
            minValue: topon.minValue,
            maxValue: topon.maxValue,
            defaultValue: topon.defaultValue
          })),
          images: variant.Images ? variant.Images.map(image => ({
            id: image.id,
            url: `${image.image}`,
            name: image.name
          })) : []
        }))
      }
    };


    return res.status(200).json(result);
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
        id: variant.id,
        name: variant.name,
        groupOptions: variant.GroupOptions ? variant.GroupOptions.map(groupOption => ({
          id: groupOption.id,
          name: groupOption.name,
          options: groupOption.Options ? groupOption.Options.map(option => ({
            id: option.id,
            name: option.name,
          })) : [],
          rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
            id: rule.id,
            name: rule.name,
            description: rule.description,
            ruleType: rule.ruleType,
            ruleValue: rule.ruleValue,
          })) : [],
        })) : [],
        topons: variant.Topons ? variant.Topons.map(topon => ({
          id: topon.id,
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
      res.status(404).json({ message: 'Product not found' });
      return
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
    await sequelize.transaction(async (transaction) => {

      product = await updateOrCreateProduct(productJson);

      const productName = productJson.name;
      const productItems = productJson.items || [];
      const toponIds = productJson.variants?.flatMap(variant => variant.topons?.map(topon => topon.toponId)) || [];
      console.log(toponIds, "toponIds")
      const locationIds = productJson.locationIds || [];
      const promises = [
        Product.findOne({ where: { name: productName } }),
        Product.findAll({ where: { id: productItems } }),
        Topons.findAll(),
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
        console.log(existingToponIds, missingTopons)
        if (missingTopons.length > 0) {
          console.log(missingTopons)
          errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
        }
      }

      /*       for (const variant of productJson.variants) {
              const toponIds = variant.topons.map(topon => topon.toponId);
              const existingToponIds = existingTopons.map(topon => topon.id);
              const missingTopons = toponIds.filter(id => !existingToponIds.includes(id));
              if (missingTopons.length > 0) {
                errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
              }
            }
       */
      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
        return
      }






      if (productJson.type === 'combo') {
        const existingComboItemIds = product.ComboItems.map(item => item.id);
        const incomingComboItemIds = productJson.items;

        const comboItemsToDelete = existingComboItemIds.filter(id => !incomingComboItemIds.includes(id));
        if (comboItemsToDelete.length > 0) {
          await ComboItem.destroy({ where: { id: comboItemsToDelete }, transaction });
        }

        await updateComboItems(product.id, productJson.items, transaction);
      } else {



        const productItem = await Product.findOne({
          where: { id: product.id },
          include: [
            {
              model: Variant,
              include: [
                {
                  model: GroupOption,
                  include: [Option, GroupRule]
                },
                Topons,
                Image
              ],
              as: 'Variants'
            },

          ]
        });

        const existingVariantIds = productItem.Variants.map(v => v.id);
        const incomingVariantIds = productJson.variants.map(v => v.id).filter(id => id !== undefined);

        const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));
        if (variantsToDelete.length > 0) {
          await Variant.destroy({ where: { id: variantsToDelete }, transaction });
        }

        for (const variantData of productJson.variants) {
          const variant = await updateOrCreateVariant(variantData, productItem.id, transaction);
          const existingGroupOptionIds = await GroupOption.findAll({ where: { VariantId: variant.id } }).then(options => options.map(option => option.id));
          const incomingGroupOptionIds = variantData.groupOptions.map(go => go.id).filter(id => id !== undefined);

          const groupOptionsToDelete = existingGroupOptionIds.filter(id => !incomingGroupOptionIds.includes(id));
          if (groupOptionsToDelete.length > 0) {
            await GroupOption.destroy({ where: { id: groupOptionsToDelete }, transaction });
          }

          for (const groupOptionData of variantData.groupOptions) {
            await updateOrCreateGroupOption(groupOptionData, variant.id, transaction);
          }

          const existingToponIds = await VariantTopons.findAll({ where: { VariantId: variant.id } }).then(topons => topons.map(topon => topon.ToponId));
          const incomingToponIds = variantData.topons.map(t => t.toponId).filter(id => id !== undefined);

          const toponsToDelete = existingToponIds.filter(id => !incomingToponIds.includes(id));
          if (toponsToDelete.length > 0) {
            await VariantTopons.destroy({ where: { ToponId: toponsToDelete }, transaction });
          }

          for (const toponData of variantData.topons) {
            await updateOrCreateTopon(toponData, variant.id, transaction);
          }



          const existingLocations = await VariantLocation.findAll({ where: { VariantId: variant.id } }).then(locations => locations.map(location => location.LocationId));
          const incomingLocations = variantData.locationIds;

          const locationsToDelete = existingLocations.filter(id => !incomingLocations.includes(id));
          if (locationsToDelete.length > 0) {
            await VariantLocation.destroy({ where: { LocationId: locationsToDelete }, transaction });
          }

          for (const locationId of incomingLocations) {
            const location = await Location.findByPk(locationId);
            if (!location) {
              throw new Error(`Location with ID ${locationId} does not exist`);
            }
            if (!variant.hasLocation(location)) {
              await variant.addLocation(location, { transaction });

            }
          }
        }
      }


      next()

    });

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
