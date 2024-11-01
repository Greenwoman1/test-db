const paginate = require('../../helpers/paginate');
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
    console.log(req.params, req.query)

    const { page = 1, limit = 1000000000 } = req.query
    const queryOptions = {
      attributes: ['id', 'name'],
    };


    const toponLocations = await ToponLocation.findAndCountAll({
      attributes: ['id', 'ToponId', 'LocationId'],
      include: [
        {
          as: 'TopLoc',
          model: Topon,
          attributes: ['id', 'name'],
        },
        {
          model: Location,
          as: 'Location',
          attributes: ['id', 'name'],
          where: { id: req.query.locationId },
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt((page - 1) * limit, 10),

    });


    const mappedRows = toponLocations.rows.map(row => ({
      id: row.id,
      name: row.TopLoc.name    
    }));


    const response = {
      count: toponLocations.count,
      rows: mappedRows,
      totalPages: Math.ceil(toponLocations.count / limit),
      currentPage: page
    }

    // console.log(JSON.stringify(toponLocations, null, 2))

    // const paginatedTopons = await paginate(Topon, queryOptions);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getToponsByLocation = async (req, res) => {
  try {
    const locationId = req.params.locationId;

    const loc = await Location.findByPk(locationId, {
      attributes: ['id', 'name'],
    });

    if (!loc) {
      return res.status(401).json({ message: `Location with id ${locationId} not found` });
    }

    const queryOptions = {
      attributes: ['id', 'name'],
      include: [
        {
          model: ToponLocation,
          as: 'TopLoc',
          attributes: [],
          where: { LocationId: locationId },
        },
      ],
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const paginatedTopons = await paginate(Topon, queryOptions);

    res.status(200).json(paginatedTopons);
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
  getToponsByLocation
};
