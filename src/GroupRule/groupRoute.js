const express = require('express');
const router = express.Router();
const groupRule = require('./groupController');

router.post('/', groupRule.createGroupRule);
router.get('/', groupRule.getGroupRules);
router.get('/:id', groupRule.getGroupRuleById);
router.put('/:id', groupRule.updateGroupRule);
router.delete('/:id', groupRule.deleteGroupRule);

module.exports = router;
