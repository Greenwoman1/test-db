const { Product, Variant, GroupOption, Option, Topons } = require('../src/index');

async function createProduct(name, description, type) {
    return await Product.create({ name, description, type });
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
        groupOptionsData.map(groupOptionData => GroupOption.create({ ...groupOptionData, VariantId: variantId }))
    );
    return groupOptions;
}

async function addOptionsToGroup(groupOptionId, optionsData) {
    const groupOption = await GroupOption.findByPk(groupOptionId);
    if (!groupOption) {
        throw new Error(`GroupOption with ID ${groupOptionId} not found`);
    }
    const options = await Promise.all(
        optionsData.map(optionData => Option.create(optionData))
    );
    await groupOption.addOptions(options);
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




async function saveProductFromJson(json) {
    try {
        // Create the product
        const product = await Product.create({
            name: json.name,
            description: json.description,
            type: json.type
        });

        for (const variantData of json.variants) {
            // Create the variant
            const variant = await Variant.create({
                name: variantData.name,
                ProductId: product.id
            });

            for (const groupOptionData of variantData.groupOptions) {
                // Create the group option
                const groupOption = await GroupOption.create({
                    name: groupOptionData.name,
                    rule: groupOptionData.rule,
                    VariantId: variant.id
                });

                for (const optionData of groupOptionData.options) {
                    // Create the option
                    await Option.create({
                        name: optionData.name,
                        GroupOptionId: groupOption.id
                    });
                }
            }

            for (const toponData of variantData.topons) {
                // Create the topon
                await Topons.create({
                    name: toponData.name,
                    quantity: toponData.quantity,
                    VariantId: variant.id
                });
            }
        }

        console.log('Proizvod je uspešno kreiran sa svim varijacijama, opcijama i toponsima.');
    } catch (error) {
        console.error('Greška prilikom kreiranja proizvoda:', error);
        throw error;
    }
}

// Primer JSON objekta za palačinke
const pancakesJson = {
    "name": "Palačinke",
    "description": "Ukusne domaće palačinke sa raznovrsnim opcijama",
    "type": "food",
    "variants": [
        {
            "name": "Čokoladna palačinka",
            "groupOptions": [
                {
                    "name": "Čokoladni dodaci",
                    "rule": "any",
                    "options": [
                        {"name": "Nutella"},
                        {"name": "Čokoladne mrvice"}
                    ]
                }
            ],
            "topons": [
                {"name": "Banana", "quantity": 2},
                {"name": "Jagoda", "quantity": 3}
            ]
        },
        {
            "name": "Obična palačinka",
            "groupOptions": [
                {
                    "name": "Dodaci za običnu palačinku",
                    "rule": "any",
                    "options": [
                        {"name": "Šećer"},
                        {"name": "Limun"}
                    ]
                }
            ],
            "topons": [
                {"name": "Med", "quantity": 1},
                {"name": "Orah", "quantity": 4}
            ]
        }
    ]
};



const createPancakesProduct = async () => {
    try {
        await saveProductFromJson(pancakesJson);
    } catch (error) {
        console.error('Greška prilikom kreiranja proizvoda:', error);
    }
}

async function getPancakesSettings() {
    try {
        const product = await Product.findOne({
            where: { name: 'Palačinke' },
            include: [
                {
                    model: Variant,
                    include: [
                        {
                            model: GroupOption,
                            include: [Option]
                        },
                        Topons
                    ]
                }
            ]
        });

        if (!product) {
            throw new Error('Product "Palačinke" not found');
        }

        const result = {
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                type: product.type,
                variants: product.Variants.map(variant => ({
                    id: variant.id,
                    name: variant.name,
                    groupOptions: variant.GroupOptions.map(groupOption => ({
                        id: groupOption.id,
                        name: groupOption.name,
                        rule: groupOption.rule,
                        options: groupOption.Options.map(option => ({
                            id: option.id,
                            name: option.name
                        }))
                    })),
                    topons: variant.Topons.map(topon => ({
                        id: topon.id,
                        name: topon.name,
                        quantity: topon.quantity
                    }))
                }))
            }
        };

        return result;
    } catch (error) {
        console.error('Error fetching product settings for Palačinke:', error);
        throw error;
    }
}


module.exports = {
    createPancakesProduct,
    getPancakesSettings
}