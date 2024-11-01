const express = require('express');
const controller = require('./controller');

module.exports = (io) => {
  const router = express.Router();

  router.get('/', (req, res) => controller.getCart(req, res, io));
  router.post('/', (req, res) => controller.setCart(req, res, io));
  router.delete('/', (req, res) => controller.clearCart(req, res, io));

  return router;
};
