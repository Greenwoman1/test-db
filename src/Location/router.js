// locationRouter.js
const express = require('express');
const router = express.Router();
const locationController = require('./locationController');

module.exports = (io) => {
  router.get('/', (req, res) => locationController.getLocations(req, res, io));
  router.post('/', (req, res) => locationController.createLocation(req, res, io));

  return router;
};
