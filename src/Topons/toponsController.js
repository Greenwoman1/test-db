const Topons = require('./Topons');

const createTopons = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const newTopons = await Topons.create({ name, quantity });
        res.status(201).json(newTopons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopons = async (req, res) => {
    try {
        const topons = await Topons.findAll();
        res.status(200).json(topons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getToponsById = async (req, res) => {
    try {
        const toponsId = req.params.id;
        const topons = await Topons.findByPk(toponsId);
        if (!topons) {
            return res.status(404).json({ message: 'Topons not found' });
        }
        res.status(200).json(topons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTopons = async (req, res) => {
    try {
        const toponsId = req.params.id;
        const { name, quantity } = req.body;
        const topons = await Topons.findByPk(toponsId);
        if (!topons) {
            return res.status(404).json({ message: 'Topons not found' });
        }
        await topons.update({ name, quantity });
        res.status(200).json({ message: 'Topons updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTopons = async (req, res) => {
    try {
        const toponsId = req.params.id;
        const topons = await Topons.findByPk(toponsId);
        if (!topons) {
            return res.status(404).json({ message: 'Topons not found' });
        }
        await topons.destroy();
        res.status(200).json({ message: 'Topons deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTopons,
    getTopons,
    getToponsById,
    updateTopons,
    deleteTopons,
};
