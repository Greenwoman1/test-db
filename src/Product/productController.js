const Product = require('./Product');
const { Variant, Topons, GroupOption, Option, GroupRule } = require('../index');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, type } = req.body;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update({ name, description, type });
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

const createProduct = async (productJson) => {
    return await Product.create({
        name: productJson.name,
        description: productJson.description,
        type: productJson.type
    });
};

const handleComboItems = async (product, items) => {
    for (const itemId of items) {
        const item = await Product.findOne({
            where: { id: itemId }
        });
        if (item) {
            await product.addComboItem(item);
        }
    }
};

const createVariant = async (variantData, productId) => {
    return await Variant.create({
        name: variantData.name,
        ProductId: productId
    });
};

const handleTopons = async (variant, topons) => {
    for (const toponData of topons) {
        const topon = await Topons.findOne({ where: { name: toponData.name } });
        if (topon) {
            await variant.addTopon(topon);
        }
    }
};

const createGroupOption = async (groupOptionData, variantId) => {
    const groupOption = await GroupOption.create({
        name: groupOptionData.name,
        type: groupOptionData.type,
        VariantId: variantId
    });

    if (groupOptionData.rules) {
        for (const ruleData of groupOptionData.rules) {
            await GroupRule.create({
                name: ruleData.name,
                description: ruleData.description,
                ruleType: ruleData.ruleType,
                ruleValue: ruleData.ruleValue,
                GroupOptionId: groupOption.id
            });
        }
    }

    if (groupOptionData.options) {
        for (const optionData of groupOptionData.options) {
            await Option.create({
                name: optionData.name,
                GroupOptionId: groupOption.id
            });
        }
    }
};

const handleVariants = async (variants, productId) => {
    for (const variantData of variants) {
        const variant = await createVariant(variantData, productId);

        if (variantData.topons) {
            await handleTopons(variant, variantData.topons);
        }

        if (variantData.groupOptions) {
            for (const groupOptionData of variantData.groupOptions) {
                await createGroupOption(groupOptionData, variant.id);
            }
        }
    }
};

const saveProductFromJson = async (req, res) => {
    const productsJson = req.body;
    try {
        for (const productJson of productsJson) {
            const product = await createProduct(productJson);

            if (productJson.type === 'combo') {
                await handleComboItems(product, productJson.items);
            } else {
                await handleVariants(productJson.variants, product.id);
            }
        }
        res.status(201).json({ message: 'Products created successfully' });
    } catch (error) {
        console.error('Error during saveProductFromJson:', error);
        res.status(500).json({ message: error.message });
    }
};
const getProductSettings = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where: { id: id },
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
                },

            ]
        });

        if (!product) {
            return res.status(401).json({ message: `Product "${id}" not found` });
        }
        const result = {
            product: {
                name: product.name,
                description: product.description,
                type: product.type,
                variants: product.Variants.map(variant => (
                    {
                        name: variant.name,
                        groupOptions: variant.GroupOptions.map(groupOption => ({
                            name: groupOption.name,
                            options: groupOption.Options.map(option => ({
                                name: option.name
                            })),

                            rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
                                name: rule.name,
                                description: rule.description,
                                ruleType: rule.ruleType,
                                ruleValue: rule.ruleValue
                            })) : []
                        })),
                        topons: variant.Topons.map(topon => ({
                            name: topon.name,
                            minValue: topon.minValue,
                            maxValue: topon.maxValue,
                            defaultValue: topon.defaultValue
                        }))
                    }))
            }
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error during getProductSettings:', error);
        res.status(500).json({ message: error.message });
    }

};
    
const getProductSettingsCombo = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where: { id: id },
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

        const comboProductSettings = {
            name: product.name,
            description: product.description,
            type: product.type,
            variants: product.comboItems.map(comboItem => ({
                name: comboItem.name,
                description: comboItem.description,
                type: comboItem.type,
                groupOptions: comboItem.Variants.flatMap(variant => variant.GroupOptions.map(groupOption => ({
                    name: groupOption.name,
                    options: groupOption.Options.map(option => ({ name: option.name })),
                    rules: groupOption.GroupRules ? groupOption.GroupRules.map(rule => ({
                        name: rule.name,
                        description: rule.description,
                        ruleType: rule.ruleType,
                        ruleValue: rule.ruleValue
                    })) : []
                }))),
                topons: comboItem.Variants.flatMap(variant => variant.Topons.map(topon => ({
                    name: topon.name,
                    minValue: topon.minValue,
                    maxValue: topon.maxValue,
                    defaultValue: topon.defaultValue
                })))
            }))
        };

        res.status(200).json(comboProductSettings);
    } catch (error) {
        console.error('Error during getProductSettingsCombo:', error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    saveProductFromJson,
    getProductSettings,
    getProductSettingsCombo
};
