
const paginate = async (model, queryOptions) => {
  const page = parseInt(queryOptions.page, 10) || 1;
  const limit = queryOptions.limit || 10; 
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await model.findAndCountAll({
      ...queryOptions,
      limit,
      offset,
    });

    return {
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      rows,
    };
  } catch (error) {
    throw new Error('Error during pagination: ' + error.message);
  }
};

module.exports = paginate;