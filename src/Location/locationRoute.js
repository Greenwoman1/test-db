const express = require('express');
const router = express.Router();

const locationController = require('./locationController');

router.post('/', locationController.createLocations);
router.get('/', locationController.getLocations);
router.get('/:locationId', locationController.getLocationById);
router.get('/:locationId/products', locationController.getProductsByLocation);
router.put('/:locationId', locationController.updateLocation);
router.delete('/:locationId', locationController.deleteLocation);

module.exports = router;
