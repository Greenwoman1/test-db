const express = require('express');
const router = express.Router();

const controller = require('../controllers/orderItemController');

router.post('/add', controller.createOrderItem);

router.get('/', controller.getOrderItems);

router.get('/:id', controller.getOrderItemById);

router.put('/update/:id', controller.updateOrderItem);

router.delete('/delete/:id', controller.deleteOrderItem);

module.exports = router;
