const { Balance } = require('../..');
const redisClient = require('../clients/redisClient');

const { getBalance } = require('./utils/index');


const setBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const result = await setBalance(userId, amount);



    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getBalance = async (req, res) => {

  const userId = req.param.userId;
  const cacheKey = `user_balance_${userId}`;

  try {
    const balance = await getBalance(userId);
    res.status(200).json(balance);
  } catch (err) {
    console.error('Error fetching user balance:', err);
    throw err;
  }
}

module.exports = { getBalance, setBalance };