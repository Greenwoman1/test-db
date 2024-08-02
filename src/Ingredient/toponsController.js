const { Topon } = require('../index');
const { SKURule } = require('../index');
const { SKU } = require('../index');

const createTopons = async (req, res) => {
  try {
    const { name, minValue, maxValue, defaultValue, stock, price, location } = req.body;
    const rule = await SKURule.create();

    const newTopons = await Topon.create({ name, minValue, maxValue, defaultValue, SKURuleId: rule.id });
    const skuUnit = await SKU.create({ name, stock, price, SKURuleId: rule.id, LocationId: location });
    res.status(201).json(newTopons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopons = async (req, res) => {
  try {
    const topons = await Topon.findAll();
    res.status(200).json(topons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getToponsById = async (req, res) => {
  try {
    const toponsId = req.params.id;
    const topons = await Topon.findByPk(toponsId, {
      attributes: ['name', 'minValue', 'maxValue', 'defaultValue'],
      include: [
        {
          model: SKURule,
          include: [

            {
              attributes: ['stock', 'price'],
              model: SKU
            }
          ]
        }
      ]
    });
    if (!topons) {
      return res.status(404).json({ message: 'Topon not found' });
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
    const topons = await Topon.findByPk(toponsId);
    if (!topons) {
      return res.status(404).json({ message: 'Topon not found' });
    }
    await topons.update({ name, quantity });
    res.status(200).json({ message: 'Topon updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTopons = async (req, res) => {
  try {
    const toponsId = req.params.id;
    const topons = await Topon.findByPk(toponsId);
    if (!topons) {
      return res.status(404).json({ message: 'Topon not found' });
    }
    await topons.destroy();
    res.status(200).json({ message: 'Topon deleted successfully' });
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
