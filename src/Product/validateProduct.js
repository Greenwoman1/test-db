const { Product, Topons } = require('../index')
const { Op } = require('sequelize');



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
    
    validateProductId
}

