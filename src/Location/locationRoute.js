const express = require('express');
const router = express.Router();
const locationController = require('./locationController');

router.post('/', locationController.createComboItem);
router.get('/', locationController.getComboItems);
router.get('/:id', locationController.getComboItemById);
router.put('/:id', locationController.updateComboItem);
router.delete('/:id', locationController.deleteComboItem);

module.exports = router;
