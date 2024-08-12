const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { validateCreateProduct, validateResults, validateProductId, validateLocationId, validateUpdateProduct, validateUpdateProductCombo, validateCreateProductCombo } = require('./validateInput');


router.get('/list', productController.list);

router.post('/', productController.createProduct);

router.get('/:productId/variants', productController.getProductVariants);

router.get('/:productId', productController.getProductById);

router.get('/:productId/:locationId', productController.getProductVariantLocation);

router.get('/:locationId', productController.getProductsAtLocation);


module.exports = router;
