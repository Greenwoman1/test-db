const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validateCreateOrder, validateResults } = require('./validateOrder');




router.post('/', validateCreateOrder, validateResults, controller.createOrder);
router.get('/', controller.createOrder);
router.post('/proccess/:orderId', controller.proccessOrder);
router.post('/cancel/:orderId', controller.rejectOrder);

module.exports = router;
