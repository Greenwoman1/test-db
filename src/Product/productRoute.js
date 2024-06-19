const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct, validateGetProductById } = require('./validateInput');
const { validateBeforeSaveToDatabase, validateProductId } = require('./validateProduct');


router.post('/', productController.createProduct);
router.get('/', productController.getProducts);


router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);



router.post('/settings', validateCreateProduct, validateBeforeSaveToDatabase, productController.saveProductFromJson)
router.get('/settings/:id', validateGetProductById, validateProductId ,  productController.getProductSettings)
router.get('/settings/combo/:id', validateGetProductById, validateProductId,  productController.getProductSettingsCombo)
module.exports = router;
