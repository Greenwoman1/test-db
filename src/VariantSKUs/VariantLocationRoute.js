const express = require('express');
const router = express.Router();
const comboItemController = require('./comboItemController');

router.post('/', locationItemController.createLocations);
router.get('/', locationItemController.getLocations);
router.get('/:locationId', locationItemController.getLocationItemById);
router.put('/:locationId', locationItemController.updateLocationItem);
router.delete('/:locationId', locationItemController.deleteLocationItem);

module.exports = router;
