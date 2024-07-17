const SKURule = require('./SKURule');

const createSKURule = async (req, res) => {
    try {
        const { name, stock, price } = req.body;
        const newSKURule = await SKURule.create({ name, stock, price });
        res.status(201).json(newSKURule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSKURules = async (req, res) => {
    try {
        const skuRules = await SKURule.findAll();
        res.status(200).json(skuRules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSKURuleById = async (req, res) => {
    try {
        const skuRuleId = req.params.id;
        const skuRule = await SKURule.findByPk(skuRuleId);
        if (!skuRule) {
            return res.status(404).json({ message: 'SKURule not found' });
        }
        res.status(200).json(skuRule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSKURule = async (req, res) => {
    try {
        const skuRuleId = req.params.id;
        const { name, stock, price } = req.body;
        const skuRule = await SKURule.findByPk(skuRuleId);
        if (!skuRule) {
            return res.status(404).json({ message: 'SKURule not found' });
        }
        await skuRule.update({ name, stock, price });
        res.status(200).json({ message: 'SKURule updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSKURule = async (req, res) => {
    try {
        const skuRuleId = req.params.id;
        const skuRule = await SKURule.findByPk(skuRuleId);
        if (!skuRule) {
            return res.status(404).json({ message: 'SKURule not found' });
        }
        await skuRule.destroy();
        res.status(200).json({ message: 'SKURule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSKURule,
    getSKURules,
    getSKURuleById,
    updateSKURule,
    deleteSKURule
};
