var express = require('express');
var router = express.Router();

const controller = require('../controllers/cartItemController');

router.get('/', controller.getCartItems);

router.post('/add', controller.createCartItem);

router.delete('/delete/:id', controller.deleteCartItem);

router.get('/:id', controller.getCartItemById);

router.post('/update/:id', controller.updateCartItem);

module.exports = router;
