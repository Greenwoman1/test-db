const { ComboItems, Combo, PriceHistory, Variant } = require('../index');

const createComboItem = async (req, res) => {
  try {
    const { combo_id, variant_id } = req.body;
    const newComboItem = await ComboItem.create({ combo_id, variant_id });
    res.status(201).json(newComboItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComboItems = async (req, res) => {
  try {
    const comboItem = await ComboItem.findAll();
    res.status(200).json(comboItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComboItemById = async (req, res) => {
  try {
    const comboId = req.params.id;
    const comboItem = await Combo.findByPk(comboId, {
      attributes: ['id', 'name'],
      include: [
        {
          model: ComboItems,
          attributes: ['id'],
          include: [
            {
              model: PriceHistory,
              attributes: ['price', 'createdAt']
            },
            {
              model: Variant,
              through: { attributes: [] },
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    if (!comboItem) {
      return res.status(404).json({ message: 'Combo item not found' });
    }
    res.status(200).json(comboItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComboItem = async (req, res) => {
  try {
    const comboItemId = req.params.id;
    const { combo_id, variant_id } = req.body;
    const comboItem = await ComboItem.findByPk(comboItemId);
    if (!comboItem) {
      return res.status(404).json({ message: 'Combo item not found' });
    }
    await comboItem.update({ combo_id, variant_id });
    res.status(200).json({ message: 'Combo item updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComboItem = async (req, res) => {
  try {
    const comboItemId = req.params.id;
    const comboItem = await ComboItem.findByPk(comboItemId);
    if (!comboItem) {
      return res.status(404).json({ message: 'Combo item not found' });
    }
    await comboItem.destroy();
    res.status(200).json({ message: 'Combo item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComboItem,
  getComboItems,
  getComboItemById,
  updateComboItem,
  deleteComboItem
};
