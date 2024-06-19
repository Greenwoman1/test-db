const {Topons} = require('../index');
const {SKURule} = require('../index');
const {SKU} = require('../index');

const createTopons = async (req, res) => {
    try {
        const { name, minValue, maxValue, defaultValue, stock, price } = req.body;
        const newTopons = await Topons.create({ name, minValue, maxValue, defaultValue });
        const rule = await SKURule.create({ name,  ToponId: newTopons.id });
        const skuUnit = await SKU.create({ name, stock, price, SKURuleId  : rule.id });
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
        const topons = await Topons.findByPk(toponsId, {
            attributes: ['name', 'minValue', 'maxValue', 'defaultValue'],
            include: [
                {
                    model: SKURule,
                    include: [
                        
                      {  attributes: [ 'stock', 'price'],
                        model: SKU}
                    ]
                }
            ]
        });
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
