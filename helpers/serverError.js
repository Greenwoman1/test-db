const { v4: uuidv4 } = require('uuid');
const { setAsync } = require('../redisClient');

const handleError = async (error, res) => {
  const rayId = uuidv4();

  try {
    await setAsync(rayId, JSON.stringify({ message: error.message, stack: error.stack }));
  } catch (redisError) {
    console.error('Failed to save error to Redis:', redisError);
  }

  res.status(500).json({ message: 'Internal server error', rayId });
};

module.exports = handleError;
