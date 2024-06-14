const Variant = require('./Variant');

const createVariant = async (req, res) => {
    try {
        const { name } = req.body;
        const newVariant = await Variant.create({ name });
        res.status(201).json(newVariant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVariants = async (req, res) => {
    try {
        const variants = await Variant.findAll();
        res.status(200).json(variants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVariantById = async (req, res) => {
    try {
        const variantId = req.params.id;
        const variant = await Variant.findByPk(variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        res.status(200).json(variant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVariant = async (req, res) => {
    try {
        const variantId = req.params.id;
        const { name } = req.body;
        const variant = await Variant.findByPk(variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        await variant.update({ name });
        res.status(200).json({ message: 'Variant updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVariant = async (req, res) => {
    try {
        const variantId = req.params.id;
        const variant = await Variant.findByPk(variantId);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        await variant.destroy();
        res.status(200).json({ message: 'Variant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVariant,
    getVariants,
    getVariantById,
    updateVariant,
    deleteVariant,
};
