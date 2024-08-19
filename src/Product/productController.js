const { v4: uuidv4 } = require('uuid');

// const { UUIDV4 } = require('sequelize');
const client = require('../../clients/elastics.js');
const paginate = require('../../helpers/paginate.js');
const sequelize = require('../../clients/sequelize');
const { Variant, Topon, Option, GroupRule, Product, Location, Image, VariantTopons, VariantLocation, GroupOptions, GroupTopons, PriceHistory, Combo, ComboItems, SKU, Category, Ingredient, IngredientLocation, ToponLocation, VariantIngredient, VariantSKURule, LinkedVariant, IngredientSKURule, GroupTopon, GroupToponsMid, ToponSKURule } = require('../index');
const { createProductHelper } = require('./utils/index');
const { setAsync } = require('../../clients/redisClient');
const handleError = require('../../helpers/serverError.js');


const list = async (req, res) => {
  try {
    const { name, description, categoryId, page = 1, limit = 5, locationId } = req.query;
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 5;
    const from = (pageNumber - 1) * pageSize;

    const query = {
      index: 'products',
      body: {
        query: {
          bool: {
            must: [
              name ? {
                bool: {
                  should: [
                    { match: { name } },
                    { fuzzy: { name } },
                  ]
                }
              } : null,
              description ? { match: { description } } : null,
              categoryId ? { term: { CategoryId: categoryId } } : null,
              locationId ? { terms: { LocationIds: [locationId] } } : null
            ].filter(Boolean)
          }
        },
        from,
        size: pageSize
      }
    };

    const result = await client.search(query);
    res.status(200).json(result.hits.hits.map(hit => hit._source));
  } catch (error) {
    await handleError(error, res);
  }
};

const createBasicProduct = async (req, res) => {
  try {
    const product = await sequelize.transaction(async (t) => {
      const product = req.body;
      const { name, description, type, CategoryId } = product;
      await client.index({ index: 'products', document: product });
      return await Product.create({ name, description, type, CategoryId }, { transaction: t });
    });
    res.status(200).json(product);
  } catch (error) {
    await handleError(error, res);
  }
};

const createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const product = req.body;

    // #region validate
    const errors = []

    const categoryId = product.CategoryId;
    const locationIds = product.variants.flatMap(variant =>
      variant.locations?.map(location => location.LocationId) || []
    );

    const skuRuleIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.skuRules?.SKUId ? [location.skuRules.SKUId] : []
      ) || []
    );

    const ingredientIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.ingredients?.map(ingredient => ingredient.id) || []
      ) || []
    );

    const ingredientSkuRuleIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.ingredients?.map(ingredient => ingredient.skuRules?.SKUId) || []
      ) || []
    );

    const toponIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.topons?.topons?.map(topon => topon.ToponId) || []
      ) || []
    );

    const toponSkuRuleIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.topons?.topons?.map(topon => topon.skuRules?.SKUId) || []
      ) || []
    );


    const comboItemVariantLocationIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.comboItems?.map(comboItem => comboItem.VariantLocationId) || []
      ) || []
    );




    const [
      category,
      locations,
      skuRules,
      ingredients,
      ingredientSkuRules,
      topons,
      toponSkuRules,
      comboItemVariantLocations,
    ] = await Promise.all([
      Category.findByPk(categoryId),
      Location.findAll({ where: { id: locationIds } }),
      SKU.findAll({ where: { id: skuRuleIds } }),
      IngredientLocation.findAll({ where: { id: ingredientIds } }),
      SKU.findAll({ where: { id: ingredientSkuRuleIds } }),
      ToponLocation.findAll({ where: { id: toponIds } }),
      SKU.findAll({ where: { id: toponSkuRuleIds } }),
      VariantLocation.findAll({ where: { id: comboItemVariantLocationIds } }),
    ]);



    if (!category) {
      errors.push({ msg: `Category with ID(${categoryId}) does not exist`, param: 'CategoryId', location: 'body' });
    }


    const existingLocationIds = locations.map(l => l.id);
    const missingLocationIds = locationIds.filter(id => !existingLocationIds.includes(id));
    if (missingLocationIds.length > 0) {
      errors.push({ msg: `Locations with IDs(${missingLocationIds.join(', ')}) do not exist`, param: 'locationIds', location: 'body' });
    }

    const existingSkuRuleIds = skuRules.map(s => s.id);
    const missingSkuRuleIds = skuRuleIds.filter(id => !existingSkuRuleIds.includes(id));
    if (missingSkuRuleIds.length > 0) {

      errors.push({ msg: `SKU Rules with IDs(${missingSkuRuleIds.join(', ')}) do not exist`, param: 'skuRuleIds', location: 'body' });
    }

    const existingIngredientIds = ingredients.map(i => i.id);
    const missingIngredientIds = ingredientIds.filter(id => !existingIngredientIds.includes(id));
    if (missingIngredientIds.length > 0) {
      errors.push({ msg: `Ingredients with IDs(${missingIngredientIds.join(', ')}) do not exist`, param: 'ingredientIds', location: 'body' });
    }

    const existingIngredientSkuRuleIds = ingredientSkuRules.map(s => s.id);
    const missingIngredientSkuRuleIds = ingredientSkuRuleIds.filter(id => !existingIngredientSkuRuleIds.includes(id));
    if (missingIngredientSkuRuleIds.length > 0) {
      errors.push({ msg: `Ingredient SKU Rules with IDs(${missingIngredientSkuRuleIds.join(', ')}) do not exist`, param: 'ingredientSkuRuleIds', location: 'body' });
    }

    const existingToponIds = topons.map(t => t.id);
    const missingToponIds = toponIds.filter(id => !existingToponIds.includes(id));
    if (missingToponIds.length > 0) {
      errors.push({ msg: `Topons with IDs(${missingToponIds.join(', ')}) do not exist`, param: 'toponIds', location: 'body' });
    }

    const existingToponSkuRuleIds = toponSkuRules.map(s => s.id);
    const missingToponSkuRuleIds = toponSkuRuleIds.filter(id => !existingToponSkuRuleIds.includes(id));
    if (missingToponSkuRuleIds.length > 0) {
      errors.push({ msg: `Topon SKU Rules with IDs(${missingToponSkuRuleIds.join(', ')}) do not exist`, param: 'toponSkuRuleIds', location: 'body' });
    }

    const existingComboItemVariantLocationIds = comboItemVariantLocations.map(c => c.id);
    const missingComboItemVariantLocationIds = comboItemVariantLocationIds.filter(id => !existingComboItemVariantLocationIds.includes(id));
    if (missingComboItemVariantLocationIds.length > 0) {
      errors.push({ msg: `Combo Item Variant Locations with IDs(${missingComboItemVariantLocationIds.join(', ')}) do not exist`, param: 'comboItemVariantLocationIds', location: 'body' });
    }



    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    // #endregion 

    const result = await sequelize.transaction(async (t) => {
      const product = await createProductHelper(req.body, t);
      await client.index({
        index: 'products',
        id: product.id,
        document: { id: product.id, name: product.name, description: product.description, type: product.type, CategoryId: product.CategoryId, LocationIds: locationIds }
      });
      return product;
    });

    return res.status(201).json(result);
  } catch (error) {
    await handleError(error, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId, { attributes: ['id', 'name', 'description', 'type'] });

    if (!product) {
      return res.status(400).json({ message: 'Product with id ' + productId + ' not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    await handleError(error, res);
  }
};

const getProductVariants = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId, { attributes: ['id', 'name', 'description', 'type'] });

    if (!product) {
      return res.status(400).json({ message: 'Product with id ' + productId + ' not found' });
    }

    const variants = await Variant.findAll({
      where: { ProductId: productId },
      attributes: ['id', 'name'],
    }).catch((error) => {
      throw error;
    });

    return res.status(200).json(variants);
  } catch (error) {
    await handleError(error, res);
  }
};

const getProductVariantLocation = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {locationId} = req.query;

    const product = await Product.findByPk(productId, { attributes: ['id', 'name', 'description', 'type'] });
    if (!product) {
      return res.status(400).json({ message: 'Product with id ' + productId + ' not found' });
    }

    const location = await Location.findByPk(locationId, { attributes: ['id', 'name'] });
    if (!location) {
      return res.status(400).json({ message: 'Location with id ' + locationId + ' not found' });
    }

    const variants = await Variant.findAll({
      where: { ProductId: productId },
      attributes: ['id', 'name'],
      include: [
        {
          model: VariantLocation,
          as: 'VarLoc',
          where: { LocationId: locationId },
          attributes: [],
        },
      ],
    }).catch((error) => {
      throw error;
    });

    return res.status(200).json(variants);
  } catch (error) {
    await handleError(error, res);
  }
};

const getProductsAtLocation = async (req, res) => {
  const { locationId } = req.query;

  try {
    const loc = await Location.findByPk(locationId, { attributes: ['id', 'name'] });

    if (!loc) {
      return res.status(400).json({ message: `Location with id ${locationId} not found` });
    }

    const queryOptions = {
      attributes: ['id', 'name'],
      include: [{
        model: Variant,
        attributes: [],
        include: [{
          model: VariantLocation,
          as: 'VarLoc',
          attributes: [],
          where: { LocationId: locationId },
        }],
      }],
    };

    const paginatedProducts = await paginate(Product, queryOptions).catch((error) => {
      throw error;
    });
    return res.status(200).json(paginatedProducts);
  } catch (error) {
    await handleError(error, res);
  }
};

const getProductDetails = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Variant,
          include: [
            {
              model: VariantLocation,
              include: [
                { model: Location },
                { model: VariantSKURule },
                { model: VariantIngredient, include: [{ model: IngredientSKURule }] },
                { model: GroupTopon, include: [{ model: GroupToponsMid, include: [{ model: ToponSKURule }] }] },
                { model: GroupOptions, include: [{ model: Option }] }
              ]
            }
          ]
        },
        {
          model: LinkedVariant, include: [{ model: VariantLocation, as: 'LinkVarLoc' }]
        }
      ]
    }).catch((error) => {
      throw error;
    });

    if (!product) {
      return res.status(400).json({ message: 'Product with id ' + productId + ' not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    await handleError(error, res);
  }
};

module.exports = { list, getProductById, getProductVariants, getProductVariantLocation, getProductsAtLocation, createProduct, createBasicProduct, getProductDetails };
