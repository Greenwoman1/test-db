const { Variant, Topons, GroupOption, Option, GroupRule , Product} = require('../index');

const { createProduct,
    handleComboItems,
    handleVariants,
    updateProduct
} = require('./utils/index');

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



const saveProductFromJson = async (req, res) => {
    const productsJson = req.body;

    let errors = [];
    try {

        const productNames = productsJson.map(product => product.name);
        const uniqueProductNames = new Set(productNames);
        const productItems = productsJson.flatMap(product => product.items || []);
        const toponsId = productsJson.flatMap(product => product.variants.flatMap(variant => variant.topons.map(topon => topon.id)));
        console.log({ productNames, uniqueProductNames, productItems, toponsId });
        const promises = [
            Product.findAll(),
            Product.findAll({ where: { id: productItems } }),
            Topons.findAll()
        ];

        const [existingProducts, existingProductItems, existingTopons] = await Promise.all(promises);

        console.log({ existingProducts, existingProductItems, existingTopons });

        if (uniqueProductNames.size !== productNames.length) {
            errors.push({ msg: 'Product names must be unique', param: 'name', location: 'body' });
        }

        const existingProductNames = existingProducts.map(product => product.name);
        const duplicateNames = productNames.filter(name => existingProductNames.includes(name));
        if (duplicateNames.length > 0) {
            errors.push({ msg: `Products with names (${duplicateNames.join(', ')}) already exist`, param: 'name', location: 'body' });
        }

        if (existingProductItems.length !== productItems.length) {
            const missingProductItems = productItems.filter(id => !existingProductItems.map(product => product.id).includes(id));
            if (missingProductItems.length > 0) {
                errors.push({ msg: `Products with ids (${missingProductItems.join(', ')}) do not exist`, param: 'items', location: 'body' });
            }
        }

        if (productsJson.some(product => product.type !== 'combo')) {
            for (const product of productsJson) {
                if (product.type !== 'combo') {
                    for (const variant of product.variants) {
                        const toponIds = variant.topons.map(topon => topon.toponId);
                        const existingToponIds = existingTopons.map(topon => topon.id);
                        console.log({ toponIds, existingToponIds });
                        const missingTopons = toponIds.filter(id => !existingToponIds.includes(id));
                        if (missingTopons.length > 0) {
                            errors.push({ msg: `Topons with IDs (${missingTopons.join(', ')}) do not exist`, param: 'topons', location: 'body' });
                        }
                    }
                }
            }
        }
        if (errors.length > 0) {
            res.status(400).json({ errors: errors });
            return
        }



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




const updateProducts = async (req, res) => {
    const updateProductsData = req.body;
    try {
        for (const productData of updateProductsData) {
            await updateProduct(productData);
        }
        console.log('Products updated or created successfully');
    } catch (error) {
        console.error('Error updating or creating products:', error);
    }
    
}
const getProductSettings = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findOne({
            where: { id: productId },
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
    const { productId } = req.params;
    try {
        const product = await Product.findOne({
            where: { id: productId },
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
    getProductSettingsCombo,
    updateProducts
};
