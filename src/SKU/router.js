// skuRouter.js
const express = require('express');
const router = express.Router();
const skuController = require('./skuController');

module.exports = (io) => {
  // POST /sku
  router.post('/', (req, res) => skuController.createSKU(req, res, io));
  
  // GET /sku
  router.get('/', (req, res) => skuController.getSKUs(req, res, io));
  
  // GET /sku/:id
  router.get('/:id', (req, res) => skuController.getSKUById(req, res, io));
  
  // PUT /sku/:id
  router.put('/:id', (req, res) => skuController.updateSKU(req, res, io));
  
  // DELETE /sku/:id
  router.delete('/:id', (req, res) => skuController.deleteSKU(req, res, io));

  return router;
};
