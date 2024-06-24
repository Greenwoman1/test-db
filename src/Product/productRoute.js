const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct,  validateResults , validateProductId, validateLocationId, validateUpdateProduct} = require('./validateInput');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/:locationId/products',validateLocationId, validateResults, productController.getProductsByLocation);
router.post('/settings',  validateCreateProduct, validateResults, productController.saveProductFromJson)
router.get('/settings/:productId', validateProductId, validateResults, productController.getProductSettings)
router.post('/settings/:productId', validateProductId, validateUpdateProduct, validateResults, productController.updateProductFromJson, productController.getProductSettings)
router.post('/settings/:productId/combo',/*  validateProductId, validateUpdateProduct, validateResults,  */productController.updateProductFromJson, productController.getProductSettings)
router.get('/settings/combo/:productId', validateProductId, validateResults, productController.getProductSettingsCombo)
module.exports = router;
