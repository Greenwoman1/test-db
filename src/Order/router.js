const express = require('express');
const { validateOrder, validateResult, validateOrderId } = require('./validateOrder');
const controller = require('./controller');

module.exports = (io) => {
  const router = express.Router();

  router.get('/', (req, res) => controller.getOrders(req, res, io));
  router.get('/:orderId', validateOrderId, validateResult, (req, res) => controller.getOrderDetailsById(req, res, io));
  
  router.post('/', /* validateOrder, validateResult, */ (req, res) => controller.createOrder(req, res, io));
  router.post('/:orderId/process', validateOrderId, validateResult, (req, res) => controller.processOrder(req, res, io));
  router.post('/:orderId/reject', validateOrderId, validateResult, (req, res) => controller.rejectOrder(req, res, io));
  router.post('/:orderId/accept', validateOrderId, validateResult, (req, res) => controller.acceptOrder(req, res, io));

  return router;
};
