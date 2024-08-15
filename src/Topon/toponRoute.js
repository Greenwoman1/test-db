const express = require('express');
const router = express.Router();
const toponsController = require('./toponController');

router.post('/', toponsController.createTopons);
router.get('/', toponsController.getTopons);
router.get('/location/:locationId', toponsController.getToponsByLocation);

module.exports = router;
