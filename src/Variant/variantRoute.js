const express = require('express');
const router = express.Router();
const variantController = require('./variantController');

router.post('/', variantController.createVariant);
router.get('/', variantController.getVariants);
router.get('/:id', variantController.getVariantById);
router.put('/:id', variantController.updateVariant);
router.delete('/:id', variantController.deleteVariant);

module.exports = router;
