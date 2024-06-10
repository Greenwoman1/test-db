var express = require('express');
var router = express.Router();

const controller = require('../controllers/productController');

router.get('/', controller.getProducts);

router.post('/add', controller.createProduct);

router.delete('/delete/:id', controller.deleteProduct);

router.get('/:id', controller.getProductById);

router.post('/update/:id', controller.updateProduct);

module.exports = router;
