const sequelize = require('../../sequelize');
const { Variant, Topons, Option, GroupRule, Product, Location, Image, VariantTopons, VariantLocation, GroupOptions, GroupTopons, PriceHistory, Combo, ComboItems } = require('../index');

const { createProduct,
  handleComboItems,
  handleVariants,
  updateOrCreateProduct,
  updateOrCreateVariant,
  updateOrCreateGroupOption,
  updateOrCreateTopon,
  updateComboItems,
  updateOrCreateGroupTopon

} = require('./utils/index');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json([...products]);
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
      const productItems = productJson?.items?.flatMap(item => item.id) || [];

      const promises = [
        Product.findOne({ where: { name: productName } }),
        // Product.findAll({ where: { id: productItems } }),
        Topons.findAll()
      ];

      const [existingProduct, existingProductItems, existingTopons] = await Promise.all(promises);

      if (existingProduct) {
        errors.push({ msg: `Product with name (${productName}) already exists`, param: 'name', location: 'body' });
      }

      /*  if (existingProductItems.length !== productItems.length) {
         const missingProductItems = productItems.filter(id => !existingProductItems.map(product => product.id).includes(id));
         if (missingProductItems.length > 0) {
           errors.push({ msg: `Products with ids (${missingProductItems.join(', ')}) do not exist`, param: 'items', location: 'body' });
         }
       } */

      if (productJson.type == 'combo') {
        const combos = await Product.findAll({ where: { name: productJson.name } });
        if (combos.length > 0) {
          errors.push({ msg: `Combo with name (${productJson.name}) already exists`, param: 'name', location: 'body' });
        }
        for (const variant of productJson?.items) {
          const productItem = await Variant.findByPk(variant);
          if (!productItem) {
            errors.push({ msg: `Combo item ${variant} does not exist`, param: 'items', location: 'body' });
          }



        }
      }

      if (errors.length > 0) {
        res.status(400).json({ errors: errors });
        return;
      }

      if (productJson.type === 'combo') {


        const combo = await handleComboItems(productJson, t);
        res.status(201).json({ message: 'Product id ' + combo.id + ' created' });

      } else {
        const product = await createProduct(productJson, t);

        await handleVariants(productJson.variants, product.id, t);
        res.status(201).json({ message: 'Product id ' + product.id + ' created' });

      }

      res.status(400)

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
      attributes: ['id', 'name', 'description', 'type'],
      include: [
        {
          model: Variant,
          as: 'Variants',
          attributes: ['id', 'name'],
          include: [
            {
              model: GroupOptions,
              as: 'GroupOptions',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Option,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: GroupTopons,
              as: 'GroupTopons',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Topons,
                  as: 'Topons',
                  attributes: ['id', 'name'],
                  through: {
                    attributes: [],
                  },
                },
              ],
            },
            {
              model: PriceHistory,
              as: 'Prices',
              attributes: ['price', 'createdAt'],
            },
            {
              model: Location,
              as: 'Locations',
              attributes: ['id', 'name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
        {
          model: Variant,
          attributes: ['id', 'name'],
          as: 'comboVariants',
          through: {
            attributes: [],
          },
          include: [
            {
              model: GroupOptions,
              as: 'GroupOptions',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Option,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: GroupTopons,
              as: 'GroupTopons',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Topons,
                  as: 'Topons',
                  attributes: ['id', 'name'],
                  through: {
                    attributes: [],
                  },
                },
              ],
            },
            {
              model: PriceHistory,
              as: 'Prices',
              attributes: ['price', 'createdAt'],
            },
            {
              model: Location,
              as: 'Locations',
              attributes: ['id', 'name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    if (!product) {
      return res.status(401).json({ message: `Product "${productId}" not found` });
    }

    // const formattedVariants = await Promise.all(product.Variants.map(async (variant) => {
    //   const price = await variant.getPrice(new Date());
    //   return {
    //     id: variant.id,
    //     name: variant.name,
    //     price: price,
    //     groupOptions: variant.GroupOptions.map(groupOption => ({
    //       id: groupOption.id,
    //       name: groupOption.name,
    //       type: groupOption.type,
    //       options: groupOption.Options.map(option => ({
    //         id: option.id,
    //         name: option.name
    //       })),
    //       rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
    //         id: rule.id,
    //         name: rule.name,
    //         description: rule.description,
    //         ruleType: rule.ruleType,
    //         ruleValue: rule.ruleValue
    //       })) : []
    //     })),
    //     topons: variant.Topons.map(topon => ({
    //       id: topon.id,
    //       name: topon.name,
    //       minValue: topon.minValue,
    //       maxValue: topon.maxValue,
    //       defaultValue: topon.defaultValue
    //     })),
    //     images: variant.Images ? variant.Images.map(image => ({
    //       id: image.id,
    //       url: `${image.image}`,
    //       name: image.name
    //     })) : []
    //   };
    // }));

    // const result = {
    //   product: {
    //     name: product.name,
    //     description: product.description,
    //     type: product.type,
    //     variants: formattedVariants
    //   }
    // };

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error during getProductSettings:', error);
    return res.status(500).json({ message: error.message });
  }
};

const formatProductResponse = (product) => {
  const formattedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    type: product.type,
    price: product.comboPrice ? product.comboPrice : null,
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
      attributes: ['id', 'name', 'description', 'type'],
      include: [
        {
          model: Variant,
          as: 'DirectVariants',
          attributes: ['id', 'name'],
          include: [
            {
              model: GroupOptions,
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Option,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: GroupTopons,
              as: 'GroupTopons',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Topons,
                  as: 'Topons',
                  attributes: ['id', 'name'],
                  through: {
                    attributes: [],
                  },
                },
              ],
            },
            {
              model: PriceHistory,
              as: 'Prices',
              attributes: ['price', 'createdAt'],
            },
            {
              model: Location,
              as: 'Locations',
              attributes: ['id', 'name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
        {
          model: Variant,
          as: 'ComboVariants',
          attributes: ['id', 'name'],
          include: [
            {
              model: GroupOptions,
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Option,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: GroupTopons,
              as: 'GroupTopons',
              attributes: ['id', 'name', 'type', 'rules'],
              include: [
                {
                  model: Topons,
                  as: 'Topons',
                  attributes: ['id', 'name'],
                  through: {
                    attributes: [],
                  },
                },
              ],
            },
            {
              model: PriceHistory,
              as: 'Prices',
              attributes: ['price', 'createdAt'],
            },
            {
              model: Location,
              as: 'Locations',
              attributes: ['id', 'name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return
    }

    // const formattedProduct = formatProductResponse(product);

    res.status(200).json(product);
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
      const locationIds = productJson.locationIds || [];
      const promises = [
        Product.findOne({ where: { name: productName } }),
        Product.findAll({ where: { id: productItems } }),
        Topons.findAll(),
        Location.findAll({ where: { id: locationIds } }),
      ];

      const [existingProduct, existingProductItems, existingTopons, existingLocations] = await Promise.all(promises);



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
        const productItem = await Product.findOne({
          where: { id: product.id },
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

        await Product.update({ name: productJson.name, description: productJson.description, type: productJson.type, comboPrice: productJson.price }, { where: { id: product.id }, transaction });

        console.log('Updating combo items...', productItem.comboItems);
        const existingComboItemIds = productItem.comboItems.map(item => item.id);
        const incomingComboItemIds = productJson.items;

        const comboItemsToDelete = existingComboItemIds.filter(id => !incomingComboItemIds.includes(id));
        if (comboItemsToDelete.length > 0) {
          await ComboItem.destroy({ where: { id: comboItemsToDelete }, transaction });
        }

        await updateComboItems(product.id, productJson.items, transaction);
      } else {


        const productItem = await Product.findOne({
          where: { id: productJson.id },
          attributes: ['id', 'name', 'description', 'type'],
          include: [
            {
              model: Variant,
              as: 'Variants',
              // attributes: ['id', 'name'],
              include: [
                {
                  model: GroupOptions,
                  as: 'GroupOptions',
                  // attributes: ['id', 'name', 'type'],
                  include: [
                    {
                      model: Option,
                      as: 'Options',
                      // attributes: ['id', 'name']
                    }
                  ]
                },
                {
                  model: GroupTopons,
                  as: 'GroupTopons',
                  // attributes: ['id', 'name', 'type'],
                  include: [
                    {
                      model: Topons,
                      as: 'Topons',
                      // attributes: ['id', 'name'],
                      through: {
                        attributes: []
                      }
                    }
                  ]
                },
                {
                  model: PriceHistory,
                  as: 'Prices',
                  // attributes: ['price', 'createdAt']
                },
                {
                  model: Location,
                  as: 'Locations',
                  // attributes: ['id', 'name'],
                  through: {
                    attributes: []
                  }
                }
              ]
            }
          ]
        });


        console.log('Updating variants...', productItem);

        /// izbrisi variante koje su izbrisane
        const existingVariantIds = productItem.Variants.map(v => v.id);
        const incomingVariantIds = productJson.Variants.map(v => v.id).filter(id => id !== undefined);

        const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));
        if (variantsToDelete.length > 0) {
          await Variant.destroy({ where: { id: variantsToDelete }, transaction });
        }



        for (const variantData of productJson.Variants) {
          const variant = await updateOrCreateVariant(variantData, productItem.id, transaction);
          const existingGroupOptionIds = await GroupOptions.findAll({ where: { VariantId: variant.id } }).then(options => options.map(option => option.id));
          const incomingGroupOptionIds = variantData.GroupOptions.map(go => go.id).filter(id => id !== undefined);

          const groupOptionsToDelete = existingGroupOptionIds.filter(id => !incomingGroupOptionIds.includes(id));
          if (groupOptionsToDelete.length > 0) {
            await GroupOptions.destroy({ where: { id: groupOptionsToDelete }, transaction });
          }

          for (const groupOptionData of variantData.GroupOptions) {
            await updateOrCreateGroupOption(groupOptionData, variant.id, transaction);
          }

          const existingGroupToponsIds = await GroupTopons.findAll({ where: { VariantId: variant.id } }).then(options => options.map(option => option.id));
          const incomingGroupToponsIds = variantData.GroupTopons.map(go => go.id).filter(id => id !== undefined);

          const groupToponsToDelete = existingGroupToponsIds.filter(id => !incomingGroupToponsIds.includes(id));
          if (groupToponsToDelete.length > 0) {
            await GroupTopons.destroy({ where: { id: groupOptionsToDelete }, transaction });
          }

          for (const groupToponData of variantData.GroupTopons) {
            await updateOrCreateGroupTopon(groupToponData, variant.id, transaction);
          }



          const existingLocations = await VariantLocation.findAll({ where: { VariantId: variant.id } }).then(locations => locations.map(location => location.LocationId));
          const incomingLocations = variantData.Locations.map(l => l.id).filter(id => id !== undefined);

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
