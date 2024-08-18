const express = require('express');
const router = express.Router();

const locationController = require('./locationController');

router.get('/', locationController.getLocations);

module.exports = router;
