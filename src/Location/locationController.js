const paginate = require('../../helpers/paginate');
const {Location} = require('../index');


const getLocations = async (req, res) => {
  try {


  
    const queryOptions = {
      attributes: ['id', 'name'],
    };

    const paginatedLocations = await paginate(Location, queryOptions);

    res.status(200).json(paginatedLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const createLocation = async (req, res) => {
  try {
    const { name } = req.body;
    const location = await Location.create({ name });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

module.exports = {

    getLocations,
    createLocation
};
