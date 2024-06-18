const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct, validateGetProductById } = require('./validateInput');
const { validateBeforeSaveToDatabase } = require('./validateProduct');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/settings', validateCreateProduct, validateBeforeSaveToDatabase, productController.saveProductFromJson)
router.get('/settings/:id', validateGetProductById,  productController.getProductSettings)
module.exports = router;
