const express = require('express');
const router = express.Router();
const skuController = require('./skuController');

router.post('/', skuController.createSKU);
router.get('/', skuController.getSKUs);
router.get('/:id', skuController.getSKUById);
router.put('/:id', skuController.updateSKU);
router.delete('/:id', skuController.deleteSKU);

module.exports = router;
