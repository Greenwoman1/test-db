const { name } = require("ejs");
const {
  Product, Variant, VariantLocation, VariantPrice, VariantSKURule,
  IngredientSKURule, LinkedVariant, GroupTopon, GroupToponsMid,
  ToponSKURule, GroupOptions, Option, VariantIngredient
} = require("../../index");

const createProductHelper = async (settings, t) => {
  const { name, type, variants, description, CategoryId } = settings;
  try {
    const product = await Product.create({ name, type, description, CategoryId }, { transaction: t });
    await createVariants(variants, product.id, t);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
const createVariants = async (variants, productId, t) => {
  await Promise.all(variants.map(async (variant) => {
    const variante = await Variant.create({ name: variant.name, ProductId: productId }, { transaction: t });
    await VariantPrice.create({ VariantId: variante.id, price: variant.price }, { transaction: t });
    await Promise.all(variant.locations.map(varLoc => createVariantLocation(variante.id, varLoc, t)));
  }));
};


const createVariantLocation = async (variantId, varLoc, t) => {
  const { LocationId, skuRules, ingredients, topons, options, comboItems } = varLoc;
  const varloc = await VariantLocation.create({ VariantId: variantId, LocationId, disabled: false }, { transaction: t });

  if (skuRules) {
    await handleSkuRules(varloc.id, skuRules, t);
  }

  if (ingredients) {
    await handleIngredient(varloc.id, ingredients, t);
  }

  if (comboItems) {
    await handleComboItems(variantId, comboItems, t);
  }

  if (topons) {
    await handleTopons(varloc.id, topons, t);
  }

  if (options) {
    await handleOptions(varloc.id, options, t);
  }
};

const handleSkuRules = async (variantLocationId, skuRules, t) => {
  const { name, unit, quantity, disabled, skuId } = skuRules;
  try {
    await VariantSKURule.create({ VariantLocationId: variantLocationId, name, unit, quantity, disabled, SKUId: skuId }, { transaction: t });
  } catch (error) {
    console.error('Error handling SKU rules:', error);
    throw error;
  }
};

const handleIngredient = async (variantLocationId, ingredients, t) => {
  try {
    await Promise.all(ingredients.map(async (ing) => {
      const varing = await VariantIngredient.create({ VariantLocationId: variantLocationId, IngredientLocationId: ing.id }, { transaction: t });

      const { name, unit, quantity, disabled, SKUId } = ing.skuRules;
      await IngredientSKURule.create({ VariantIngredientId: varing.id, name, unit, quantity, disabled, SKUId }, { transaction: t });
    }));
  } catch (error) {
    console.error('Error handling ingredients:', error);
    throw error;
  }
};

const handleComboItems = async (variantId, comboItems, t) => {
  try {
    await Promise.all(comboItems.map(item =>
      LinkedVariant.create({
        VariantId: variantId,
        VariantLocationId: item.VariatLocationId,
        quantity: item.quantity || 1
      }, { transaction: t })
    ));
  } catch (error) {
    console.error('Error handling combo items:', error);
    throw error;
  }
};

const handleTopons = async (variantLocationId, topons, trans) => {
  try {
    const { interfaceRules, topons: innerTopons } = topons;
    const gt = await GroupTopon.create({ VariantLocationId: variantLocationId, rules: interfaceRules }, { transaction: trans });

    await Promise.all(innerTopons.map(async (t) => {
      const gtmid = await GroupToponsMid.create({
        GroupToponId: gt.id,
        ToponLocationId: t.ToponId,
        min: t.minTopon,
        max: t.maxTopon,
        default: 0,
        disabled: false
      }, { transaction: trans });

      const { name, unit, quantity, disabled, SKUId } = t.skuRules;
      await ToponSKURule.create({ GroupToponsMidId: gtmid.id, name, unit, quantity, disabled, SKUId }, { transaction: trans });
    }));
  } catch (error) {
    console.error('Error handling topons:', error);
    throw error;
  }
};

const handleOptions = async (variantLocationId, options, t) => {
  try {
    await Promise.all(options.map(async (opt) => {
      const go = await GroupOptions.create({ VariantLocationId: variantLocationId, name: opt.name, rules: opt.rules }, { transaction: t });

      await Promise.all(opt.options.map(o =>
        Option.create({ name: o, GroupOptionId: go.id }, { transaction: t })
      ));
    }));
  } catch (error) {
    console.error('Error handling options:', error);
    throw error;
  }
};


module.exports = {
  createProductHelper,
  createVariants,
  handleSkuRules,
  handleIngredient,
  handleComboItems,
  handleTopons,
  handleOptions
};
