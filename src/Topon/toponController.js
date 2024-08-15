const { Topon, ToponLocation, Location } = require('../index');
const { SKURule } = require('../index');
const { SKU } = require('../index');

const createTopons = async (req, res) => {
  try {

    const { name, locations, price } = req.body;

    const newTopons = await Topon.create({ name, price });

    for (let i = 0; i < locations.length; i++) {
      await ToponLocation.create({ ToponId: newTopons.id, LocationId: locations[i] });
    }

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

const getToponsByLocation = async (req, res) => {
  try {
    const locationId = req.params.locationId;

    const loc = await Location.findByPk(locationId, {

    })

    if (!loc) {
      return res.status(401).json({ message: 'Location with id ' + locationId + ' not found' });
    }
    const topons = await Topon.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: ToponLocation,
          as: 'TopLoc',
          attributes: [],
          where: { LocationId: locationId }
        }
      ]
    });
    res.status(200).json(topons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
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
  getToponsByLocation
};
