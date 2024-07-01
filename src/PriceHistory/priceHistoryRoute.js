const express = require('express');
const router = express.Router();
const priceController = require('./priceController');

router.get('/', priceController);
router.post('/', priceController);
module.exports = router;
