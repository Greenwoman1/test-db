
const { Product, Variant, Topons, GroupOption, Option, GroupRule, VariantLocation, Location, SKURule, SKU, ComboItem, Price } = require("../../index");


const createProduct = async (productJson) => {
  return await Product.create({
    name: productJson.name,
    description: productJson.description,
    type: productJson.type
  });
};

const handleComboItems = async (product, items, locationId, t) => {
  for (const itemId of items) {
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
  }
};

const createVariant = async (variantData, productId, t) => {
  return await Variant.create({
    name: variantData.name,
    ProductId: productId
  },
    { transaction: t });
};

const handleTopons = async (variant, topons, t) => {
  for (const toponData of topons) {
    const topon = await Topons.findOne({ where: { id: toponData.toponId } });
    if (topon) {
      await variant.addTopon(topon, { transaction: t });
    }
  }
};

const createGroupOption = async (groupOptionData, variantId, t) => {
  console.log(groupOptionData)
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
      await Option.create({
        name: optionData.name,
        GroupOptionId: groupOption.id
      }, { transaction: t });
    }
  }
};

const handleVariants = async (variants, productId, t) => {
  for (const variantData of variants) {
    const variant = await createVariant(variantData, productId, t);

    if (variantData.price) {
      await Price.create({
        price: variantData.price,
        itemId: variant.id,
      }, {transaction: t});

    }

    if (variantData.topons) {
      await handleTopons(variant, variantData.topons, t);
    }

    if (variantData.groupOptions) {
      console.log(variantData.groupOptions)
      for (const groupOptionData of variantData.groupOptions) {
        await createGroupOption(groupOptionData, variant.id, t);
      }
    }

    if (variantData.locationIds) {
      for (const locationId of variantData.locationIds) {
        const location = await Location.findOne({ where: { id: locationId } });
        if (location) {
          await variant.addLocation(location, { transaction: t });

          const rule = await SKURule.create({
            name: `${variant.name} Rule for ${location.name}`,
            VariantId: variant.id,
            LocationId: location.id
          }, { transaction: t });
          await SKU.create({
            name: `${variant.name} SKU for ${location.name}`,
            stock: 100,
            price: 10,
            SKURuleId: rule.id
          }, { transaction: t });
        }
      }
    }
  }
};



const updateOrCreateTopon = async (toponData, variantId, t) => {
  const { toponId } = toponData;
  try {

    const variant = await Variant.findByPk(variantId);
    const exist = await variant.hasTopon(toponId);
    if (exist) {
      return;
    }

    variant.addTopon(toponId);

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
      await variant.update({
        name
      }, { transaction: t });
    } else {
      variant = await Variant.create({
        name,
        ProductId: productId
      }, { transaction: t });
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
  const { id, name, type, options, rules } = groupOptionData;

  try {
    let groupOption;

    if (id) {
      groupOption = await GroupOption.findByPk(id);
    }

    if (groupOption) {
      await groupOption.update({
        name,
        type
      }, { transaction: t });
    } else {
      groupOption = await GroupOption.create({
        name,
        type,
        VariantId: variantId
      }, { transaction: t });
    }

    await updateOrCreateOptions(options, groupOption.id, t);

    await updateOrCreateRules(rules, groupOption.id, t);

    return groupOption;
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
  updateComboItems


}