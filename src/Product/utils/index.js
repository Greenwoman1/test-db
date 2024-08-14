const { 
  Product, Variant, Topon, GroupOption, Option, GroupRule, Location, 
  SKURule, SKU, ComboItem, Price, PriceHistory, GroupTopons, GroupOptions, 
  GroupToponsMid, Combo, ComboItems, ComboVariants, VariantSKUs, 
  VariantSKURule, VariantLocation, IngredientSKURule, LinkedVariant, 
  GroupTopon, ToponSKURule, VariantIngredient 
} = require("../../index");

const createProductHelper = async (settings, t) => {
  const { name, type, variants, description, CategoryId } = settings;
  try {
    const product = await Product.create({ name, type, description, CategoryId }, { transaction: t });

    for (const variant of variants) {
      const variante = await Variant.create({ name: variant.name, ProductId: product.id }, { transaction: t });

      for (const varLoc of variant.locations) {
        const { LocationId, skuRules, ingredients, topons, options, comboItems } = varLoc;
        const varloc = await VariantLocation.create({ VariantId: variante.id, LocationId, disabled: false }, { transaction: t });

        if (skuRules) {
          await handleSkuRules(varloc.id, skuRules, t);
        } else if (ingredients) {
          await handleIngredient(varloc.id, ingredients, t);
        } else if (comboItems) {
          await handleComboItems(variante.id, comboItems, t);
        }

        if (topons) {
          await handleTopons(varloc.id, topons, t);
        }

        if (options) {
          await handleOptions(varloc.id, options, t);
        }
      }
    }

    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error; 
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
    for (const ing of ingredients) {
      const varing = await VariantIngredient.create({ VariantLocationId: variantLocationId, IngredientLocationId: ing.id }, { transaction: t });
      const { name, unit, quantity, disabled, SKUId } = ing.skuRules;
      await IngredientSKURule.create({ VariantIngredientId: varing.id, name, unit, quantity, disabled, SKUId: SKUId }, { transaction: t });
    }
  } catch (error) {
    console.error('Error handling ingredients:', error);
    throw error; 
  }
};

const handleComboItems = async (variantId, comboItems, t) => {
  try {
    for (const item of comboItems) {
      await LinkedVariant.create({ VariantId: variantId, VariantLocationId: item.VariatLocationId, quantity: item.quantity || 1 }, { transaction: t });
    }
  } catch (error) {
    console.error('Error handling combo items:', error);
    throw error; 
  }
};

const handleTopons = async (variantLocationId, topons, trans) => {
  try {
    const { interfaceRules, topons: innerTopons } = topons;
    const gt = await GroupTopon.create({ VariantLocationId: variantLocationId, rules: interfaceRules }, { transaction: trans });

    for (const t of innerTopons) {
      const gtmid = await GroupToponsMid.create({ GroupToponId: gt.id, ToponLocationId: t.ToponId, min: t.minTopon, max: t.maxTopon, default: 0, disabled: false }, { transaction: trans });
      const { name, unit, quantity, disabled, SKUId } = t.skuRules;
      await ToponSKURule.create({ GroupToponsMidId: gtmid.id, name, unit, quantity, disabled, SKUId: SKUId }, { transaction: trans });
    }
  } catch (error) {
    console.error('Error handling topons:', error);
    throw error; 
  }
};

const handleOptions = async (variantLocationId, options, t) => {
  try {
    for (const opt of options) {
      const go = await GroupOptions.create({ VariantLocationId: variantLocationId, name: opt.name, rules: opt.rules }, { transaction: t });
      for (const o of opt.options) {
        await Option.create({ name: o, GroupOptionId: go.id }, { transaction: t });
      }
    }
  } catch (error) {
    console.error('Error handling options:', error);
    throw error; 
  }
};

module.exports = {
  createProductHelper,
  handleComboItems,
  handleTopons,
  handleOptions
};
