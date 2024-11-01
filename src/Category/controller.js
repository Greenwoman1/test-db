const paginate = require("../../helpers/paginate");
const Category = require("./Category");

 const getCategories = async (req, res) => {

  try {

    
    const queryOptions = {
      attributes: ['id', 'name'],
    };

    const paginatedCategories = await paginate(Category, queryOptions);

    res.status(200).json(paginatedCategories);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }


}

module.exports = { getCategories } 