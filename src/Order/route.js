const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validateCreateOrder, validateResults } = require('./validateOrder');

router.post('/', controller.createOrder);

router.post('/proccess/:orderId', controller.proccessOrder);

router.post('/reject/:orderId', controller.rejectOrder);

router.post('/accept/:orderId', controller.acceptOrder);



module.exports = router;
