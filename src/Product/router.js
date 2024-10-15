const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct, validateResults, validateProductId, validateLocationId, validateUpdateProduct, validateUpdateProductCombo, validateCreateProductCombo } = require('./validateInput');
const { validateProduct, validateResult } = require('./validateInput');
const { authentication } = require('../Auth/utils');


// router.get('/list', productController.list);
router.get('/', authentication, productController.list);

router.post('/', validateProduct, validateResult, productController.createProduct);
// nr treba hendlovat poseban create
// router.post('/create', productController.createBasicProduct)

router.get('/:productId/variants', validateProductId, validateResult, productController.getProductVariants);

router.get('/:productId', validateProductId, validateResult, productController.getProductById);

// router.get('/location/:locationId', validateLocationId, validateResult, productController.getProductsAtLocation);
router.get('/variants', validateLocationId, validateResult, productController.getProductsAtLocation);
// router.get('/variants/?locationId', validateLocationId, validateResult, productController.getProductsAtLocation);

router.get('/:productId/variants', validateProductId, validateLocationId, validateResult, productController.getProductVariantLocation);
// router.get('/:productId?locationId', validateProductId, validateLocationId, validateResult, productController.getProductVariantLocation);



module.exports = router;
