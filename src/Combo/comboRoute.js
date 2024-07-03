const express = require('express');
const router = express.Router();
const comboController = require('./comboController');
router.post('/', comboController.createComboItem);
router.get('/', comboController.getComboItems);
router.get('/:id', comboController.getComboItemById);
router.put('/:id', comboController.updateComboItem);
router.delete('/:id', comboController.deleteComboItem);

module.exports = router;
