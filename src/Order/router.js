const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validateOrder, validateResult, validateOrderId, validateLocationId } = require('./validateOrder');

router.get('/', controller.getOrders);

router.get('/:orderId', validateOrderId, validateResult, controller.getOrderDetailsById);

router.post('/', validateOrder, validateResult, controller.createOrder);

router.post('/:orderId/proccess', validateOrderId, validateResult, controller.processOrder);

router.post('/:orderId/reject', validateOrderId, validateResult, controller.rejectOrder);

router.post('/:orderId/accept', validateOrderId, validateResult, controller.acceptOrder);




module.exports = router;
