const express = require('express');
const router = express.Router();
const toponsController = require('./toponsController');

router.post('/', toponsController.createTopons);
router.get('/', toponsController.getTopons);
router.get('/:id', toponsController.getToponsById);
router.put('/:id', toponsController.updateTopons);
router.delete('/:id', toponsController.deleteTopons);

module.exports = router;
