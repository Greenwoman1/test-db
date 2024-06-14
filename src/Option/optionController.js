const GroupRules = require('./GroupRules');

const createGroupRule = async (req, res) => {
    try {
        const { name, rule } = req.body;
        const newGroupRule = await GroupRules.create({ name, rule });
        res.status(201).json(newGroupRule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupRules = async (req, res) => {
    try {
        const groupRules = await GroupRules.findAll();
        res.status(200).json(groupRules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupRuleById = async (req, res) => {
    try {
        const groupRuleId = req.params.id;
        const groupRule = await GroupRules.findByPk(groupRuleId);
        if (!groupRule) {
            return res.status(404).json({ message: 'Group rule not found' });
        }
        res.status(200).json(groupRule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroupRule = async (req, res) => {
    try {
        const groupRuleId = req.params.id;
        const { name, rule } = req.body;
        const groupRule = await GroupRules.findByPk(groupRuleId);
        if (!groupRule) {
            return res.status(404).json({ message: 'Group rule not found' });
        }
        await groupRule.update({ name, rule });
        res.status(200).json({ message: 'Group rule updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupRule = async (req, res) => {
    try {
        const groupRuleId = req.params.id;
        const groupRule = await GroupRules.findByPk(groupRuleId);
        if (!groupRule) {
            return res.status(404).json({ message: 'Group rule not found' });
        }
        await groupRule.destroy();
        res.status(200).json({ message: 'Group rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createGroupRule,
    getGroupRules,
    getGroupRuleById,
    updateGroupRule,
    deleteGroupRule
};
