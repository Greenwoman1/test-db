const express = require('express');
const router = express.Router();
const comboItemController = require('./comboItemController');

router.post('/', comboItemController.createComboItem);
router.get('/', comboItemController.getComboItems);
router.get('/:id', comboItemController.getComboItemById);
router.put('/:id', comboItemController.updateComboItem);
router.delete('/:id', comboItemController.deleteComboItem);

module.exports = router;
