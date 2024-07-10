const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validateCreateOrder, validateResults } = require('./validateOrder');




router.post('/', validateCreateOrder, validateResults, controller.createOrder);
router.get('/', controller.createOrder);

module.exports = router;
