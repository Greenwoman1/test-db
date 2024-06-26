const {Location} = require('../index');


const getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = {

    getLocations
};
