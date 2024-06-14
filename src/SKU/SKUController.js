const SKU = require('./SKU');

const createSKU = async (req, res) => {
    try {
        const { name, stock, price } = req.body;
        const newSKU = await SKU.create({ name, stock, price });
        res.status(201).json(newSKU);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSKUs = async (req, res) => {
    try {
        const skus = await SKU.findAll();
        res.status(200).json(skus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSKUById = async (req, res) => {
    try {
        const skuId = req.params.id;
        const sku = await SKU.findByPk(skuId);
        if (!sku) {
            return res.status(404).json({ message: 'SKU not found' });
        }
        res.status(200).json(sku);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSKU = async (req, res) => {
    try {
        const skuId = req.params.id;
        const { name, stock, price } = req.body;
        const sku = await SKU.findByPk(skuId);
        if (!sku) {
            return res.status(404).json({ message: 'SKU not found' });
        }
        await sku.update({ name, stock, price });
        res.status(200).json({ message: 'SKU updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSKU = async (req, res) => {
    try {
        const skuId = req.params.id;
        const sku = await SKU.findByPk(skuId);
        if (!sku) {
            return res.status(404).json({ message: 'SKU not found' });
        }
        await sku.destroy();
        res.status(200).json({ message: 'SKU deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSKU,
    getSKUs,
    getSKUById,
    updateSKU,
    deleteSKU
};
