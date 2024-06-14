const Combo = require('./Combo');

const createCombo = async (req, res) => {
    try {
        const { name, price } = req.body;
        const newCombo = await Combo.create({ name, price });
        res.status(201).json(newCombo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCombos = async (req, res) => {
    try {
        const combos = await Combo.findAll();
        res.status(200).json(combos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getComboById = async (req, res) => {
    try {
        const comboId = req.params.id;
        const combo = await Combo.findByPk(comboId);
        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }
        res.status(200).json(combo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCombo = async (req, res) => {
    try {
        const comboId = req.params.id;
        const { name, price } = req.body;
        const combo = await Combo.findByPk(comboId);
        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }
        await combo.update({ name, price });
        res.status(200).json({ message: 'Combo updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCombo = async (req, res) => {
    try {
        const comboId = req.params.id;
        const combo = await Combo.findByPk(comboId);
        if (!combo) {
            return res.status(404).json({ message: 'Combo not found' });
        }
        await combo.destroy();
        res.status(200).json({ message: 'Combo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCombo,
    getCombos,
    getComboById,
    updateCombo,
    deleteCombo
};
