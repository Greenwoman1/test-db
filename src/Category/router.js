// categoriesRouter.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

module.exports = (io) => {
  // POST /categories
  router.get('/', (req, res) => controller.getCategories(req, res, io));

  return router;
};
