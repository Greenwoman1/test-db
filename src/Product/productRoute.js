const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct,  validateResults } = require('./validateInput');
const { validateProductId } = require('./validateProduct');


router.post('/', productController.createProduct);
router.get('/', productController.getProducts);


router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);



router.post('/settings',  validateCreateProduct, validateResults, productController.saveProductFromJson)
router.get('/settings/:productId', validateProductId, validateResults, productController.getProductSettings)
router.get('/settings/combo/:productId', validateProductId, validateResults, productController.getProductSettingsCombo)
module.exports = router;
