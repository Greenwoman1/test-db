const { Product } = require('../index')
const { Op } = require('sequelize');

const validateBeforeSaveToDatabase = async (req, res, next) => {
    try {
        const products = req.body;
        const productNames = products.map(product => product.name);
        const uniqueProductNames = new Set(productNames);
        let errors = [];

        if (uniqueProductNames.size !== productNames.length) {
            errors.push({ msg: 'Product names must be unique' });
        }

        const existingProducts = await Product.findAll();

        if (existingProducts.length > 0) {
            const existingProductNames = existingProducts.map(product => product.name);
            const duplicateNames = productNames.filter(name => existingProductNames.includes(name));
            if (duplicateNames.length > 0) {
                errors.push({ msg: `Products with names (${duplicateNames.join(', ')}) already exist` });

            }
        }


        if (products && Array.isArray(products)) {
            const productIds = products.map(product => product.items).flat();
            const existingProductIds = (await Product.findAll({
                where: {
                    id: {
                        [Op.in]: productIds
                    }
                }
            })).map(product => product.id);

            if (existingProductIds.length === productIds.length) {
                const missingProductIds = productIds.filter(id => !existingProductIds.includes(id));
                if (missingProductIds.length > 0) {
                    errors.push({ msg: `Products with ids (${missingProductIds.join(', ')}) do not exist` });
                }
            }
        }
        if (errors.length > 0) {
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

