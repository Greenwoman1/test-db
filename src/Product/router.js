const express = require('express');
const multer = require('multer');
const productController = require('./productController');
const {
  validateCreateProduct,
  validateResults,
  validateProductId,
  validateLocationId,
  validateUpdateProduct,
  validateUpdateProductCombo,
  validateCreateProductCombo,
  validateProduct,
  validateResult
} = require('./validateInput');
const { authentication } = require('../Auth/utils');

const upload = multer();

module.exports = (io) => {
  const router = express.Router();

  router.get('/', authentication, (req, res) => productController.list(req, res, io));

  router.post('/', validateProduct, validateResult, (req, res) => productController.createProduct(req, res, io));

  router.get('/menu', (req, res) => productController.getMenu(req, res, io));

  router.get('/:productId/variants', validateProductId, validateResult, (req, res) => 
    productController.getProductVariants(req, res, io)
  );

  router.get('/:productId', validateProductId, validateResult, (req, res) => 
    productController.getProductById(req, res, io)
  );

  router.get('/variants', validateLocationId, validateResult, (req, res) => 
    productController.getProductsAtLocation(req, res, io)
  );

  router.get('/:productId/variants', validateProductId, validateLocationId, validateResult, (req, res) => 
    productController.getProductVariantLocation(req, res, io)
  );

  return router;
};
