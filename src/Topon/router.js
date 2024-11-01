// toponsRouter.js
const express = require('express');
const router = express.Router();
const toponsController = require('./toponController');

module.exports = (io) => {
  router.post('/', (req, res) => toponsController.createTopons(req, res, io));
  router.get('/', (req, res) => toponsController.getTopons(req, res, io));
  router.get('/location/:locationId', (req, res) => toponsController.getToponsByLocation(req, res, io));

  return router;
};
