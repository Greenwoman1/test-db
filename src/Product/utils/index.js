
const { name } = require("ejs");
const { Product, Variant, Topons, GroupOption, Option, GroupRule, VariantLocation, Location, SKURule, SKU, ComboItem, Price, PriceHistory, GroupTopons, GroupOptions, GroupToponsMid, Combo, ComboItems, ComboVariants } = require("../../index");


const createProduct = async (productJson) => {
  return await Product.create({
    name: productJson.name,
    description: productJson.description,
    type: productJson.type,
    comboPrice: productJson.price ? productJson.price : null
  });
};

const handleComboItems = async (product, t) => {

  const combo = await Product.create({
    name: product.name,
    type: product.type,
    description: product.description
  }, {
    transaction: t
  })



  const price = await PriceHistory.create({
    price: product.price,
    itemId: combo.id,
    itemType: 'ComboVariants',

  }, { transaction: t })

  for (const comboVar of product.items) {
    const v = await Variant.findByPk(comboVar)

    const item = await ComboVariants.create({
      ProductId: combo.id,
      VariantId: v.id
    }, { transaction: t })


  }

  return combo
  /* for (const itemId of items) {
    const item = await Product.findOne({
      where: { id: itemId }
    });
    if (item) {
      await product.addComboItem(item, { transaction: t });

      const variants = await Variant.findAll({ where: { ProductId: item.id } });
      for (const variant of variants) {
        console.log(variant, locationId);
        for (location of locationId) {
          console.log(location, variant.id);
          const variantLocation = await VariantLocation.findOne({
            where: { VariantId: variant.id, LocationId: location }
          });
          if (!variantLocation) {
            throw new Error(`Variant ${variant.name} of combo item ${item.name} does not exist at location ${location}`);
          }
        }


      }
    }
  } */
};

const createVariant = async (variantData, productId, t) => {
  return await Variant.create({
    name: variantData.name,
    ProductId: productId
  },
    { transaction: t });
};

const handleTopons = async (variant, groupTopons, t) => {
  const group = await GroupTopons.create({
    name: groupTopons.name,
    type: groupTopons.type,
    rules: groupTopons.rules,
    VariantId: variant.id
  }, { transaction: t });

  for (const toponData of groupTopons.topons) {
    const topon = await Topons.findOne({ where: { id: toponData.toponId } });
    if (topon) {
      await GroupToponsMid.create({
        ToponId: topon.id,
        GroupToponId: group.id,
        rules: toponData.rules
      }, { transaction: t });
    }
  }
};

const handleOptions = async (variant, groupOptions, t) => {
  const group = await GroupOptions.create({
    name: groupOptions.name,
    type: groupOptions.type,
    rules: groupOptions.rules,
    VariantId: variant.id
  }, { transaction: t });


  for (const option of groupOptions.options) {
    await Option.create({
      name: option,
      GroupOptionId: group.id
    }, { transaction: t });
  }
};

const createGroupOption = async (groupOptionData, variantId, t) => {
  const groupOption = await GroupOption.create({
    name: groupOptionData.name,
    type: groupOptionData.type,
    VariantId: variantId
  }, { transaction: t });

  if (groupOptionData.rules) {
    for (const ruleData of groupOptionData.rules) {
      await GroupRule.create({
        name: ruleData.name,
        description: ruleData.description,
        ruleType: ruleData.ruleType,
        ruleValue: ruleData.ruleValue,
        GroupOptionId: groupOption.id
      }, { transaction: t });
    }
  }

  if (groupOptionData.options) {
    for (const optionData of groupOptionData.options) {
      await Option.bulkCreate({
        name: optionData,
        GroupOptionId: groupOption.id
      }, { transaction: t });
    }
  }
};

const handleVariants = async (variants, productId, t) => {
  for (const variantData of variants) {
    const variant = await createVariant(variantData, productId, t);

    if (variantData.price) {
      await PriceHistory.create({
        itemId: variant.id,
        price: variantData.price,
        itemType: 'Variant',

      }, { transaction: t });

    }

    if (variantData.groupTopons) {
      for (const toponData of variantData.groupTopons) {
        await handleTopons(variant, toponData, t);
      }
    }

    if (variantData.groupOptions) {

      for (const option of variantData.groupOptions) {
        await handleOptions(variant, option, t);
      }
    }

    // if (variantData.locationIds) {
    //   for (const locationId of variantData.locationIds) {
    //     const location = await Location.findOne({ where: { id: locationId } });
    //     if (location) {
    //       await variant.addLocation(location, { transaction: t });

    //       const rule = await SKURule.create({
    //         name: `${variant.name} Rule for ${location.name}`,
    //         LocationId: location.id
    //       }, { transaction: t });
    //       await SKU.create({
    //         name: `${variant.name} SKU for ${location.name}`,
    //         stock: 100,
    //         price: 10,
    //         SKURuleId: rule.id
    //       }, { transaction: t });
    //     }
    //   }
    // }
  }
};



const updateOrCreateTopon = async (toponData, groupToponId, t) => {

  const { id: toponId, name } = toponData;
  try {
    const groupTopon = await GroupTopons.findByPk(groupToponId);
    const exist = await groupTopon.hasTopon(toponId);
    if (exist) {
      return;
    }

    const topon = await Topons.findOne({ where: { id: toponId } });
    if (!topon) {
      throw new Error(`Topon with id ${toponId} not found`);
    }
    await GroupTopons.addTopon(topon);

  } catch (error) {
    console.error('Error updating/creating topon:', error);
    throw error;
  }
};

const updateOrCreateProduct = async (productData, t) => {
  const { id, name, description, type, variants } = productData;

  try {
    let product = await Product.findByPk(id);

    if (product) {
      await product.update({
        name,
        description,
        type
      }, { transaction: t });
    } else {
      product = await Product.create({

        name,
        description,
        type
      }, { transaction: t });
    }

    return product;
  } catch (error) {
    console.error('Error updating/creating product:', error);
    throw error;
  }
};

const updateOrCreateVariant = async (variantData, productId, t) => {
  const { id, name } = variantData;

  try {
    let variant;




    if (id) {
      variant = await Variant.findByPk(id);
    }


    if (variant) {
      if (variantData.price) {
        await Price.create({
          price: variantData.price,
          itemId: variant.id,
        }, { transaction: t });

      }
      await variant.update({
        name
      }, { transaction: t });
    } else {

      variant = await Variant.create({
        name,
        ProductId: productId
      }, { transaction: t });
      if (variantData.price) {
        await Price.create({
          price: variantData.price,
          itemId: variant.id,
        }, { transaction: t });

      }
    }
    return variant;
  } catch (error) {
    console.error('Error updating/creating variant:', error);
    throw error;
  }
};



const updateComboItems = async (productId, comboItems, transaction) => {
  const product = await Product.findByPk(productId);
  await ComboItem.destroy({ where: { comboId: productId }, transaction });
  for (const item of comboItems) {

    const productItem = await Product.findByPk(item);
    if (!productItem) {
      throw new Error(`Combo item ${item} does not exist`);
    }
    await product.addComboItem(productItem, { transaction });
  }
};

const updateOrCreateGroupOption = async (groupOptionData, variantId, t) => {
  const { id, name, type, Options, Rules } = groupOptionData;

  try {
    let groupOption;
    if (id) {
      groupOption = await GroupOptions.findByPk(id);
    }

    if (groupOption) {
      await groupOption.update({
        name,
        type,
        rules: Rules,
      }, { transaction: t });
    } else {
      groupOption = await GroupOption.create({
        name,
        type,
        VariantId: variantId,
        rules: Rules
      }, { transaction: t });
    }

    await updateOrCreateOptions(Options, groupOption.id, t);


    return groupOption;
  } catch (error) {
    console.error('Error updating/creating group option:', error);
    throw error;
  }
};

const updateOrCreateGroupTopon = async (groupOptionData, variantId, t) => {
  const { id, name, type, Topons, Rules } = groupOptionData;

  try {
    let GroupTopon;

    if (id) {
      GroupTopon = await GroupTopons.findByPk(id);
    }

    if (GroupTopon) {
      await GroupTopon.update({
        name,
        type,
        rules: Rules,
      }, { transaction: t });
    } else {
      GroupTopon = await GroupTopons.create({
        name,
        type,
        VariantId: variantId,
        rules: Rules
      }, { transaction: t });
    }
    for (const topon of Topons) {
      await updateOrCreateTopon(topon, GroupTopon.id, t);
    }


    return GroupTopon;
  } catch (error) {
    console.error('Error updating/creating group option:', error);
    throw error;
  }
};

const updateOrCreateOptions = async (optionsData, groupOptionId, t) => {
  try {
    for (const optionData of optionsData) {
      const { id, name } = optionData;

      let option;

      if (id) {
        option = await Option.findByPk(id);
      }

      if (option) {
        await option.update({
          name,
          GroupOptionId: groupOptionId
        }, { transaction: t });
      } else {
        await Option.create({
          name,
          GroupOptionId: groupOptionId
        }, { transaction: t });
      }
    }
  } catch (error) {
    console.error('Error updating/creating options:', error);
    throw error;
  }
};

const updateOrCreateRules = async (rulesData, groupOptionId, t) => {
  try {
    for (const ruleData of rulesData) {
      const { id, name, description, ruleType, ruleValue } = ruleData;

      let rule;

      if (id) {
        rule = await GroupRule.findByPk(id);
      }

      if (rule) {
        await rule.update({
          name,
          description,
          ruleType,
          ruleValue,
          GroupOptionId: groupOptionId
        }, { transaction: t });
      } else {
        await GroupRule.create({
          name,
          description,
          ruleType,
          ruleValue,
          GroupOptionId: groupOptionId
        }, { transaction: t });
      }
    }
  } catch (error) {
    console.error('Error updating/creating rules:', error);
    throw error;
  }
};



module.exports = {
  createProduct,
  handleComboItems,
  handleVariants,
  handleTopons,
  createGroupOption,
  handleVariants,
  updateOrCreateProduct,
  updateOrCreateVariant,
  updateOrCreateGroupOption,
  updateOrCreateTopon,
  updateComboItems,
  updateOrCreateGroupTopon


}