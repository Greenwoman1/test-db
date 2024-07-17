const express = require('express');
const router = express.Router();
const skuRuleController = require('./skuRuleController');

router.post('/', skuRuleController.createSKURule);
router.get('/', skuRuleController.getSKURules);
router.get('/:id', skuRuleController.getSKURuleById);
router.put('/:id', skuRuleController.updateSKURule);
router.delete('/:id', skuRuleController.deleteSKURule);

module.exports = router;
