const express = require('express');
const router = express.Router();
const groupRulesController = require('./groupRulesController');

router.post('/', groupRulesController.createGroupRule);
router.get('/', groupRulesController.getGroupRules);
router.get('/:id', groupRulesController.getGroupRuleById);
router.put('/:id', groupRulesController.updateGroupRule);
router.delete('/:id', groupRulesController.deleteGroupRule);

module.exports = router;
