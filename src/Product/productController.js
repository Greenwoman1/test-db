const paginate = require('../../helpers/paginate.js');
const sequelize = require('../../sequelize');
const { Variant, Topon, Option, GroupRule, Product, Location, Image, VariantTopons, VariantLocation, GroupOptions, GroupTopons, PriceHistory, Combo, ComboItems, SKU, Category, Ingredient, IngredientLocation, ToponLocation } = require('../index');
const { createProductHelper } = require('./utils/index');


const list = async (req, res) => {
  try {
    const products = await Product.findAll({ attributes: ['id', 'name', 'description', 'type'] });
    return res.status(200).json(products);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const product = req.body

    // #region validate
    const errors = [];

    const categoryId = product.CategoryId;
    const locationIds = product.variants.flatMap(variant =>
      variant.locations?.map(location => location.LocationId) || []
    );

    const skuRuleIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.skuRules?.SKUId ? [location.skuRules.SKUId] : []
      ) || []
    );
    console.log(JSON.stringify(skuRuleIds, null, 2));

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

    const optionIds = product.variants.flatMap(variant =>
      variant.locations?.flatMap(location =>
        location.options?.flatMap(option => option.options) || []
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
      options,
      comboItemVariantLocations,
    ] = await Promise.all([
      Category.findByPk(categoryId),
      Location.findAll({ where: { id: locationIds } }),
      SKU.findAll({ where: { id: skuRuleIds } }),
      IngredientLocation.findAll({ where: { id: ingredientIds } }),
      SKU.findAll({ where: { id: ingredientSkuRuleIds } }),
      ToponLocation.findAll({ where: { id: toponIds } }),
      SKU.findAll({ where: { id: toponSkuRuleIds } }),
      Option.findAll({ where: { id: optionIds } }),
      VariantLocation.findAll({ where: { id: comboItemVariantLocationIds } }),
    ]);



    if (!category) {
      errors.push({ msg: `Category with ID (${categoryId}) does not exist`, param: 'CategoryId', location: 'body' });
    }


    const existingLocationIds = locations.map(l => l.id);
    const missingLocationIds = locationIds.filter(id => !existingLocationIds.includes(id));
    if (missingLocationIds.length > 0) {
      errors.push({ msg: `Locations with IDs (${missingLocationIds.join(', ')}) do not exist`, param: 'locationIds', location: 'body' });
    }

    const existingSkuRuleIds = skuRules.map(s => s.id);
    const missingSkuRuleIds = skuRuleIds.filter(id => !existingSkuRuleIds.includes(id));
    if (missingSkuRuleIds.length > 0) {
      console.log(missingSkuRuleIds);
      console.log(skuRuleIds);
      console.log(skuRules);
      console.log(existingSkuRuleIds);
      errors.push({ msg: `SKU Rules with IDs (${missingSkuRuleIds.join(', ')}) do not exist`, param: 'skuRuleIds', location: 'body' });
    }

    const existingIngredientIds = ingredients.map(i => i.id);
    const missingIngredientIds = ingredientIds.filter(id => !existingIngredientIds.includes(id));
    if (missingIngredientIds.length > 0) {
      errors.push({ msg: `Ingredients with IDs (${missingIngredientIds.join(', ')}) do not exist`, param: 'ingredientIds', location: 'body' });
    }

    const existingIngredientSkuRuleIds = ingredientSkuRules.map(s => s.id);
    const missingIngredientSkuRuleIds = ingredientSkuRuleIds.filter(id => !existingIngredientSkuRuleIds.includes(id));
    if (missingIngredientSkuRuleIds.length > 0) {
      errors.push({ msg: `Ingredient SKU Rules with IDs (${missingIngredientSkuRuleIds.join(', ')}) do not exist`, param: 'ingredientSkuRuleIds', location: 'body' });
    }

    const existingToponIds = topons.map(t => t.id);
    const missingToponIds = toponIds.filter(id => !existingToponIds.includes(id));
    if (missingToponIds.length > 0) {
      errors.push({ msg: `Topons with IDs (${missingToponIds.join(', ')}) do not exist`, param: 'toponIds', location: 'body' });
    }

    const existingToponSkuRuleIds = toponSkuRules.map(s => s.id);
    const missingToponSkuRuleIds = toponSkuRuleIds.filter(id => !existingToponSkuRuleIds.includes(id));
    if (missingToponSkuRuleIds.length > 0) {
      errors.push({ msg: `Topon SKU Rules with IDs (${missingToponSkuRuleIds.join(', ')}) do not exist`, param: 'toponSkuRuleIds', location: 'body' });
    }

    const existingOptionIds = options.map(o => o.id);
    const missingOptionIds = optionIds.filter(id => !existingOptionIds.includes(id));
    if (missingOptionIds.length > 0) {
      errors.push({ msg: `Options with IDs (${missingOptionIds.join(', ')}) do not exist`, param: 'optionIds', location: 'body' });
    }

    const existingComboItemVariantLocationIds = comboItemVariantLocations.map(c => c.id);
    const missingComboItemVariantLocationIds = comboItemVariantLocationIds.filter(id => !existingComboItemVariantLocationIds.includes(id));
    if (missingComboItemVariantLocationIds.length > 0) {
      errors.push({ msg: `Combo Item Variant Locations with IDs (${missingComboItemVariantLocationIds.join(', ')}) do not exist`, param: 'comboItemVariantLocationIds', location: 'body' });
    }



    if (errors.length > 0) {
      return res.status(401).json({ errors: errors });
    }
    //  #endregion 

    const result = await sequelize.transaction(async (t) => {



      const product = await createProductHelper(req.body, t);
      return product
    })
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

const getProductById = async (req, res) => {

  try {

    const productId = req.params.productId;
    const product = await Product.findByPk(productId, {
      attributes: ['id', 'name', 'description', 'type'],
    });

    if (!product) {
      res.status(401).json({ message: 'Product with id ' + productId + ' not found' });
      return
    }

    return res.status(200).json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getProductVariants = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findByPk(productId, {
      attributes: ['id', 'name', 'description', 'type'],
    });

    if (!product) {
      res.status(401).json({ message: 'Product with id ' + productId + ' not found' });
      return
    }

    const variants = await Variant.findAll({
      where: { ProductId: productId },
      attributes: ['id', 'name'],
    });
    return res.status(200).json(variants);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getProductVariantLocation = async (req, res) => {

  try {

    const productId = req.params.productId;
    const locationId = req.params.locationId;


    const product = await Product.findByPk(productId, {
      attributes: ['id', 'name', 'description', 'type'],
    });

    if (!product) {
      res.status(401).json({ message: 'Product with id ' + productId + ' not found' });
      return
    }

    const location = await Location.findByPk(locationId, {
      attributes: ['id', 'name'],

    })

    if (!location) {
      res.status(401).json({ message: 'Location with id ' + locationId + ' not found' });
      return
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
    });


    return res.status(200).json(variants);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' + error.message });
  }
}

const getProductsAtLocation = async (req, res) => {
  const locationId = req.params.locationId;

  const loc = await Location.findByPk(locationId, {
    attributes: ['id', 'name'],
  });

  if (!loc) {
    return res.status(401).json({ message: `Location with id ${locationId} not found` });
  }

  try {
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

    const paginatedProducts = await paginate(Product, queryOptions);

    return res.status(200).json(paginatedProducts);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = { list, getProductById, getProductVariants, getProductVariantLocation, getProductsAtLocation, createProduct }