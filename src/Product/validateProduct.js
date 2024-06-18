const {Product} = require('../index')
const validateBeforeSaveToDatabase = async (req, res, next) => {
    try {
        const products = req.body;

        const productNames = products.map(product => product.name);
        const uniqueProductNames = new Set(productNames);
        console.log(uniqueProductNames)
        
        if (uniqueProductNames.size !== productNames.length) {
            return res.status(400).json({ errors: [{ msg: 'Product names must be unique' }] });
        }

        const existingProducts = await Product.findAll();

        if (existingProducts.length > 0) {
            const existingProductNames = existingProducts.map(product => product.name);
            const duplicateNames = productNames.filter(name => existingProductNames.includes(name));
            return res.status(400).json({ errors: [{ msg: `Products with names (${duplicateNames.join(', ')}) already exist` }] });
        }

        next();
    } catch (error) {
        console.error('Error during validation before saving to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const validateBeforeUpdate = async (req, res ) =>{

    
}

module.exports = {
        validateBeforeSaveToDatabase
}


