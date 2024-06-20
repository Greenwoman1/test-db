const { Product, Topons } = require('../index')
const { Op } = require('sequelize');

const validateBeforeSaveToDatabase = async (req, res, next) => {
    try {
        const products = req.body;
        const productNames = products.map(product => product.name);
        const uniqueProductNames = new Set(productNames);
        let errors = [];
        if (uniqueProductNames.size !== productNames?.length) {
            errors.push({ msg: 'Product names must be unique' });
        }

        const existingProducts = await Product.findAll();


        if (existingProducts?.length > 0) {
            const existingProductNames = existingProducts.map(product => product.name);
            const duplicateNames = productNames.filter(name => existingProductNames.includes(name));
            if (duplicateNames?.length > 0) {
                errors.push({ msg: `Products with names (${duplicateNames.join(', ')}) already exist` });

            }
        }
        if (products && Array.isArray(products)) {
            const productItems = products.flatMap(product => product.items || []);
            if (productItems?.length > 0) {
                const existingProductItems = (await Product.findAll({
                    where: {
                        id: {
                            [Op.in]: productItems
                        }
                    }
                })).map(product => product.id);

                if (existingProductItems?.length !== productItems?.length) {
                    const missingProductItems = productItems.filter(id => !existingProductItems.includes(id));
                    if (missingProductItems?.length > 0) {
                        console.log({ missingProductItems })
                        errors.push({ msg: `Products with ids (${missingProductItems.join(', ')}) do not exist` });
                    }
                }
            }
        }

        if (products && Array.isArray(products) && products.type === 'combo') {
            for (const product of products) {
                console.log(product)
                for (const variant of product.variants) {
                    const toponNames = await variant?.topons?.map(topon => topon.name);
                    console.log({ toponNames })
                    let existingTopons = []
                    if (toponNames?.length > 0) {
                        existingTopons = await Topons.findAll({
                            where: {
                                name: {
                                    [Op.in]: toponNames
                                }
                            }
                        });

                        const existingToponNames = existingTopons?.map(topon => topon.name);
                        const missingTopons = await toponNames.filter(name => !existingToponNames.includes(name));
                        if (missingTopons?.length > 0) {
                            errors.push({ msg: `Topons with names (${missingTopons.join(', ')}) do not exist` });
                        }
                    }

                }
            }
        }
        if (errors?.length > 0) {
            return res.status(400).json({ errors: errors });
        }

        next();
    } catch (error) {
        console.error('Error during validation before saving to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const validateProductId = async (req, res, next) => {
    try {
        const productId = req.params.id;
        console.log(productId);
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    validateBeforeSaveToDatabase,
    validateProductId
}

