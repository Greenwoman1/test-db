const { Product, Variant, GroupOption, Option, Topons, Combo } = require('./index');
async function createProduct(name) {
    return await Product.create({ name, type : 'single' });
}

async function addVariants(productId, variantsData) {
    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
    }
    const variants = await Promise.all(
        variantsData.map(variantData => Variant.create({ ...variantData, ProductId: productId }))
    );
    return variants;
}

async function addGroupOptions(variantId, groupOptionsData) {
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
        throw new Error(`Variant with ID ${variantId} not found`);
    }
    const groupOptions = await Promise.all(
        groupOptionsData.map(groupOptionData => GroupOption.create({ ...groupOptionData, VariantId: variantId , rule: 'any' }))
    );
    return groupOptions;
    
}

async function addOptions(groupOptionId, optionsData) {
    const groupOption = await GroupOption.findByPk(groupOptionId);
    if (!groupOption) {
        throw new Error(`GroupOption with ID ${groupOptionId} not found`);
    }
    const options = await Promise.all(
        optionsData.map(optionData => Option.create({ ...optionData, GroupOptionId: groupOptionId }))
    );
    return options;
}

async function addOptionsToGroup(groupOptionId, optionsData) {
    const groupOption = await GroupOption.findByPk(groupOptionId);
    if (!groupOption) {
        throw new Error(`GroupOption with ID ${groupOptionId} not found`);
    }
    const options = await Promise.all(
        optionsData.map(optionData => Option.create(optionData))
    );
    await groupOption.addOptionsToGroup(options);
    return options;
}

async function addTopons(variantId, toponsData) {
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
        throw new Error(`Variant with ID ${variantId} not found`);
    }
    const topons = await Promise.all(
        toponsData.map(toponData => Topons.create(toponData))
    );
    await variant.addTopons(topons);
    return topons;
}

async function createCombo(productId, comboData, variantIds) {
    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
    }
    const combo = await Combo.create({ ...comboData, productId: productId, price : 200 });
    const variants = await Variant.findAll({ where: { id: variantIds } });
    await combo.addVariants(variants);
    return combo;
}



async function getComboDetails(comboId) {
    try {
        const combo = await Combo.findByPk(comboId, {
            attributes: ['id', 'name', 'price'],
            include: [
                {
                    model: Variant,
                    attributes: ['id', 'name'] 
                }
            ]
        });

        if (!combo) {
            throw new Error(`Kombo sa ID-jem ${comboId} nije pronađen`);
        }

        return combo;
    } catch (error) {
        console.error("Greška prilikom dohvatanja detalja o komboima:", error.message);
        throw error;
    }
}


async function getVariantDetails(variantId) {
    try {
        const variant = await Variant.findByPk(variantId, {
            attributes: ['id', 'name'], 
            include: [
                {
                    model: GroupOption,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Option,
                            attributes: ['id', 'name'] 
                        }
                    ]
                },
                {
                    model: Topons,
                    attributes: ['id', 'name'] 
                }
            ]
        });

        if (!variant) {
            throw new Error(`Varijanta sa ID-jem ${variantId} nije pronađena`);
        }

        return variant;
    } catch (error) {
        console.error("Greška prilikom dohvatanja detalja o varijanti:", error.message);
        throw error;
    }
}


module.exports = { createProduct, addVariants, addGroupOptions, addOptionsToGroup, addTopons, createCombo, getVariantDetails, getComboDetails };
