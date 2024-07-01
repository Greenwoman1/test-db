const GroupOptions = require('./GroupOptions');

const createGroupOption = async (req, res) => {
    try {
        const { name, rule } = req.body;
        const newGroupOption = await GroupOptions.create({ name, rule });
        res.status(201).json(newGroupOption);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupOptions = async (req, res) => {
    try {
        const groupOptions = await GroupOptions.findAll();
        res.status(200).json(groupOptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupOptionById = async (req, res) => {
    try {
        const groupOptionId = req.params.id;
        const groupOption = await GroupOptions.findByPk(groupOptionId);
        if (!groupOption) {
            return res.status(404).json({ message: 'Group option not found' });
        }
        res.status(200).json(groupOption);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroupOption = async (req, res) => {
    try {
        const groupOptionId = req.params.id;
        const { name, rule } = req.body;
        const groupOption = await GroupOptions.findByPk(groupOptionId);
        if (!groupOption) {
            return res.status(404).json({ message: 'Group option not found' });
        }
        await groupOption.update({ name, rule });
        res.status(200).json({ message: 'Group option updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupOption = async (req, res) => {
    try {
        const groupOptionId = req.params.id;
        const groupOption = await GroupOptions.findByPk(groupOptionId);
        if (!groupOption) {
            return res.status(404).json({ message: 'Group option not found' });
        }
        await groupOption.destroy();
        res.status(200).json({ message: 'Group option deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createGroupOption,
    getGroupOptions,
    getGroupOptionById,
    updateGroupOption,
    deleteGroupOption
};
