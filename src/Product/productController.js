const Product = require('./Product');
const { Variant, Topons, GroupOption, Option } = require('../index');
const createProduct = async (req, res) => {
    try {
        const { name, description, type } = req.body;
        const newProduct = await Product.create({ name, description, type });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
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
const saveProductFromJson = async (req, res) => {
    const productsJson = req.body;
    try {
        for (const productJson of productsJson) {
            const product = await Product.create({
                name: productJson.name,
                description: productJson.description,
                type: productJson.type
            });

            for (const variantData of productJson.variants) {
                const variant = await Variant.create({
                    name: variantData.name,
                    ProductId: product.id
                });

                if (variantData?.topons) {
                    for (const toponData of variantData.topons) {
                        await Topons.create({
                            name: toponData.name,
                            quantity: toponData.quantity
                        });
                        const topon = await Topons.findOne({ where: { name: toponData.name } });
                        if (topon) {
                            await variant.addTopons(topon);
                        } else {
                            console.warn(`Topon '${toponData.name}' not found.`);
                        }
                    }
                }

                if(variantData.groupOptions ){for (const groupOptionData of variantData.groupOptions) {
                    const groupOption = await GroupOption.create({
                        name: groupOptionData.name,
                        type: groupOptionData.type,
                        rule: groupOptionData.rule,
                        VariantId: variant.id
                    });

                    for (const optionData of groupOptionData.options) {
                        await Option.create({
                            name: optionData.name,
                            GroupOptionId: groupOption.id
                        });
                    }
                }}
            }

        }
        res.status(201).json({ message: 'Products created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductSettings = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where: { name: id },
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
            throw new Error(`Product "${id}" not found`);
        }

        const result = {
            product: {
                name: product.name,
                description: product.description,
                type: product.type,
                variants: product.Variants.map(variant => ({
                    name: variant.name,
                    groupOptions: variant.GroupOptions.map(groupOption => ({
                        name: groupOption.name,
                        options: groupOption.Options.map(option => ({
                            name: option.name
                        }))
                    })),
                    topons: variant.Topons.map(topon => ({
                        name: topon.name,
                        quantity: topon.quantity
                    }))
                }))
            }
        };

        res.status(200).json(result);
    } catch (error) {
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
    getProductSettings
};
