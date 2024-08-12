
const { name } = require("ejs");
const { Product, Variant, Topon, GroupOption, Option, GroupRule, Location, SKURule, SKU, ComboItem, Price, PriceHistory, GroupTopons, GroupOptions, GroupToponsMid, Combo, ComboItems, ComboVariants, VariantSKUs, VariantSKURule, VariantLocation, IngredientSKURule, LinkedVariant, GroupTopon, ToponSKURule } = require("../../index");


const createProductHelper = async (settings) => {
  const { name, type, variants, description, CategoryId } = settings;
  const product = await Product.create({ name, type, description, CategoryId });

  for (const variant of variants) {
    const variante = await Variant.create({ name: variant.name, ProductId: product.id });
    for (const varLoc of variant.locations) {
      const { LocationId, skuRules, ingredients, topons, options, comboItems } = varLoc;
      const varloc = await VariantLocation.create({ VariantId: variante.id, LocationId, disabled: false });


      if (skuRules) {

        await handleSkuRules(varloc.id, skuRules);
      } else if (ingredients) {
        await handleIngredient(varloc.id, ingredients);
      } else if (comboItems) {
        await handleComboItems(variante.id, comboItems);
      }

      if (topons) {
        await handleTopons(varloc.id, topons);
      }

      if (options) {
        await handleOptions(varloc.id, options);
      }
    }
  }

  return product;
};


const handleSkuRules = async (variantLocationId, skuRules) => {
  const { name, unit, quantity, disabled, skuId } = skuRules;
  await VariantSKURule.create({ VariantLocationId: variantLocationId, name, unit, quantity, disabled, SKUId: skuId });
};

const handleIngredient = async (variantLocationId, ingredients) => {
  for (const ing of ingredients) {
    const varing = await VariantIngredient.create({ VariantLocationId: variantLocationId, IngredientId: ing.id });
    const { name, unit, quantity, disabled, SKUId } = ing.skuRules;
    await IngredientSKURule.create({ VariantIngredientId: varing.id, name, unit, quantity, disabled, SKUId: SKUId });
  }
};

const handleComboItems = async (variantId, comboItems) => {
  for (const item of comboItems) {
    await LinkedVariant.create({ VariantId: variantId, VariantLocationId: item.VariatLocationId, quantity: item.quantity || 1 });
  }
};

const handleTopons = async (variantLocationId, topons) => {

  const { interfaceRules, minTopon, maxTopon, topons: innerTopons } = topons;
  const gt = await GroupTopon.create({ VariantLocationId: variantLocationId, rules: interfaceRules });
  for (const t of innerTopons) {
    const gtmid = await GroupToponsMid.create({ GroupToponId: gt.id, ToponLocationId: t.ToponId, min: minTopon, max: maxTopon, default: 0, disabled: false });

    const { name, unit, quantity, disabled, SKUId } = t.skuRules;
    await ToponSKURule.create({ GroupToponsMidId: gtmid.id, name, unit, quantity, disabled, SKUId: SKUId });
  }


};

const handleOptions = async (variantLocationId, options) => {
  for (const opt of options) {
    const go = await GroupOptions.create({ VariantLocationId: variantLocationId, name: opt.name, rules: opt.rules });
    for (const o of opt.options) {
      await Option.create({ name: o, GroupOptionId: go.id });
    }
  }
};




// const createVariant = async (variantData, locationIds, productId, t) => {
//   try {
//     const variant = await Variant.create({
//       name: variantData.name,
//       ProductId: productId
//     },
//       { transaction: t });
//     return variant

//   } catch (error) {
//     console.error('Error creating variant:', error);
//     throw error;
//   }


// };


// const createGroupOption = async (groupOptionData, variantId, t) => {
//   const groupOption = await GroupOption.create({
//     name: groupOptionData.name,
//     type: groupOptionData.type,
//     VariantId: variantId
//   }, { transaction: t });

//   if (groupOptionData.rules) {
//     for (const ruleData of groupOptionData.rules) {
//       await GroupRule.create({
//         name: ruleData.name,
//         description: ruleData.description,
//         ruleType: ruleData.ruleType,
//         ruleValue: ruleData.ruleValue,
//         GroupOptionId: groupOption.id
//       }, { transaction: t });
//     }
//   }

//   if (groupOptionData.options) {
//     for (const optionData of groupOptionData.options) {
//       await Option.bulkCreate({
//         name: optionData,
//         GroupOptionId: groupOption.id
//       }, { transaction: t });
//     }
//   }
// };

// const handleVariants = async (variants, locationIds, product, t) => {
//   for (const variantData of variants) {
//     const variant = await createVariant(variantData, locationIds, product.id, t);
//     await variant.save({ transaction: t });

//     if (variantData.price) {
//       await PriceHistory.create({
//         itemId: variant.id,
//         price: variantData.price,
//         itemType: 'Variant',
//       }, { transaction: t });
//     }

//     if (variantData.groupTopons) {
//       for (const toponData of variantData.groupTopons) {
//         await handleTopons(variant, toponData, t);
//       }
//     }

//     if (variantData.groupOptions) {
//       for (const option of variantData.groupOptions) {
//         await handleOptions(variant, option, t);
//       }
//     }


//     if (variantData.SKUIds) {
//       for (const skuId of variantData.SKUIds) {
//         const sku = await SKU.findOne({ where: { id: skuId } });
//         if (sku) {
//           await variant.addSKU(sku, { transaction: t });

//           const rule = await SKURule.create({
//             name: `${variant.name} Rule for ${sku.name}`,
//             SKUId: sku.id
//           }, { transaction: t });
//         }
//       }
//     }
//   }
// };


// const updateOrCreateTopon = async (toponData, groupToponId, t) => {

//   const { id: toponId, name } = toponData;
//   try {
//     const groupTopon = await GroupTopons.findByPk(groupToponId);
//     const exist = await groupTopon.hasTopon(toponId);
//     if (exist) {
//       return;
//     }

//     const topon = await Topon.findOne({ where: { id: toponId } });
//     if (!topon) {
//       throw new Error(`Topon with id ${toponId} not found`);
//     }
//     await GroupTopons.addTopon(topon);

//   } catch (error) {
//     console.error('Error updating/creating topon:', error);
//     throw error;
//   }
// };

// const updateOrCreateProduct = async (productData, t) => {
//   const { id, name, description, type, variants } = productData;

//   try {
//     let product = await Product.findByPk(id);

//     if (product) {
//       await product.update({
//         name,
//         description,
//         type
//       }, { transaction: t });
//     } else {
//       product = await Product.create({

//         name,
//         description,
//         type
//       }, { transaction: t });
//     }

//     return product;
//   } catch (error) {
//     console.error('Error updating/creating product:', error);
//     throw error;
//   }
// };

// const updateOrCreateVariant = async (variantData, productId, t) => {
//   const { id, name } = variantData;

//   try {
//     let variant;




//     if (id) {
//       variant = await Variant.findByPk(id);
//     }


//     if (variant) {
//       if (variantData.price) {
//         await Price.create({
//           price: variantData.price,
//           itemId: variant.id,
//         }, { transaction: t });

//       }
//       await variant.update({
//         name
//       }, { transaction: t });
//     } else {

//       variant = await Variant.create({
//         name,
//         ProductId: productId
//       }, { transaction: t });
//       if (variantData.price) {
//         await Price.create({
//           price: variantData.price,
//           itemId: variant.id,
//         }, { transaction: t });

//       }
//     }
//     return variant;
//   } catch (error) {
//     console.error('Error updating/creating variant:', error);
//     throw error;
//   }
// };



// const updateComboItems = async (productId, comboItems, transaction) => {
//   const product = await Product.findByPk(productId);
//   await ComboItem.destroy({ where: { comboId: productId }, transaction });
//   for (const item of comboItems) {

//     const productItem = await Product.findByPk(item);
//     if (!productItem) {
//       throw new Error(`Combo item ${item} does not exist`);
//     }
//     await product.addComboItem(productItem, { transaction });
//   }
// };

// const updateOrCreateGroupOption = async (groupOptionData, variantId, t) => {
//   const { id, name, type, Options, Rules } = groupOptionData;

//   try {
//     let groupOption;
//     if (id) {
//       groupOption = await GroupOptions.findByPk(id);
//     }

//     if (groupOption) {
//       await groupOption.update({
//         name,
//         type,
//         rules: Rules,
//       }, { transaction: t });
//     } else {
//       groupOption = await GroupOption.create({
//         name,
//         type,
//         VariantId: variantId,
//         rules: Rules
//       }, { transaction: t });
//     }

//     await updateOrCreateOptions(Options, groupOption.id, t);


//     return groupOption;
//   } catch (error) {
//     console.error('Error updating/creating group option:', error);
//     throw error;
//   }
// };

// const updateOrCreateGroupTopon = async (groupOptionData, variantId, t) => {
//   const { id, name, type, Topon, Rules } = groupOptionData;

//   try {
//     let GroupTopon;

//     if (id) {
//       GroupTopon = await GroupTopons.findByPk(id);
//     }

//     if (GroupTopon) {
//       await GroupTopon.update({
//         name,
//         type,
//         rules: Rules,
//       }, { transaction: t });
//     } else {
//       GroupTopon = await GroupTopons.create({
//         name,
//         type,
//         VariantId: variantId,
//         rules: Rules
//       }, { transaction: t });
//     }
//     for (const topon of Topon) {
//       await updateOrCreateTopon(topon, GroupTopon.id, t);
//     }


//     return GroupTopon;
//   } catch (error) {
//     console.error('Error updating/creating group option:', error);
//     throw error;
//   }
// };

// const updateOrCreateOptions = async (optionsData, groupOptionId, t) => {
//   try {
//     for (const optionData of optionsData) {
//       const { id, name } = optionData;

//       let option;

//       if (id) {
//         option = await Option.findByPk(id);
//       }

//       if (option) {
//         await option.update({
//           name,
//           GroupOptionId: groupOptionId
//         }, { transaction: t });
//       } else {
//         await Option.create({
//           name,
//           GroupOptionId: groupOptionId
//         }, { transaction: t });
//       }
//     }
//   } catch (error) {
//     console.error('Error updating/creating options:', error);
//     throw error;
//   }
// };

// const updateOrCreateRules = async (rulesData, groupOptionId, t) => {
//   try {
//     for (const ruleData of rulesData) {
//       const { id, name, description, ruleType, ruleValue } = ruleData;

//       let rule;

//       if (id) {
//         rule = await GroupRule.findByPk(id);
//       }

//       if (rule) {
//         await rule.update({
//           name,
//           description,
//           ruleType,
//           ruleValue,
//           GroupOptionId: groupOptionId
//         }, { transaction: t });
//       } else {
//         await GroupRule.create({
//           name,
//           description,
//           ruleType,
//           ruleValue,
//           GroupOptionId: groupOptionId
//         }, { transaction: t });
//       }
//     }
//   } catch (error) {
//     console.error('Error updating/creating rules:', error);
//     throw error;
//   }
// };



module.exports = {
  createProductHelper,
  handleComboItems,
  // handleVariants,
  handleTopons,
  // createGroupOption,
  // handleVariants,
  // updateOrCreateProduct,
  // updateOrCreateVariant,
  // updateOrCreateGroupOption,
  // updateOrCreateTopon,
  // updateComboItems,
  // updateOrCreateGroupTopon


}