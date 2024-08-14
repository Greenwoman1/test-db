const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct, validateResults, validateProductId, validateLocationId, validateUpdateProduct, validateUpdateProductCombo, validateCreateProductCombo } = require('./validateInput');
const { validateProduct, validateResult } = require('./validateInput');


router.get('/list', productController.list);

router.post('/', validateProduct, validateResult, productController.createProduct);

router.get('/:productId/variants', validateProductId, validateResult, productController.getProductVariants);

router.get('/:productId', validateProductId, validateResult, productController.getProductById);

router.get('/:productId/:locationId', validateProductId, validateLocationId, validateResult, productController.getProductVariantLocation);

router.get('/:locationId', validateLocationId, validateResult, productController.getProductsAtLocation);


module.exports = router;
