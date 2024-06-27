const express = require('express');
const router = express.Router();

const locationController = require('./locationController');

router.get('/', locationController.getLocations);
router.post('/', locationController.createLocation);
module.exports = router;
