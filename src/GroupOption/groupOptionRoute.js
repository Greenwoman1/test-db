const express = require('express');
const router = express.Router();
const groupOptionsController = require('./groupOptionsController');

router.post('/', groupOptionsController.createGroupOption);
router.get('/', groupOptionsController.getGroupOptions);
router.get('/:id', groupOptionsController.getGroupOptionById);
router.put('/:id', groupOptionsController.updateGroupOption);
router.delete('/:id', groupOptionsController.deleteGroupOption);

module.exports = router;
