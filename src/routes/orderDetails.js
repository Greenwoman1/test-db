const express = require('express');
const router = express.Router();

const controller = require('../controllers/orderDetailsController');

router.post('/add', controller.createOrderDetails);

router.get('/', controller.getOrderDetails);

router.get('/:id', controller.getOrderDetailsById);

router.put('/update/:id', controller.updateOrderDetails);

router.delete('/delete/:id', controller.deleteOrderDetails);

module.exports = router;
