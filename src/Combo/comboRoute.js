const express = require('express');
const router = express.Router();
const comboController = require('./comboController');

router.post('/', comboController.createCombo);
router.get('/', comboController.getCombos);
router.get('/:id', comboController.getComboById);
router.put('/:id', comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

module.exports = router;