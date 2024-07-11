const { Balance } = require('../..');
const redisClient = require('../redisClient');


const setBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const result = await sequelize.transaction(async (t) => {
      const newBalance = await Balance.create({
        userId,
        amount,
        date: new Date(),
        reason: 'Initial Balance',
        comment: 'New balance added',
      }, { transaction: t });

      const totalBalance = await Balance.sum('amount', { where: { userId }, transaction: t });

      await redisClient.set(`user_balance_${userId}`, JSON.stringify(totalBalance), 'EX', 36000);

      return totalBalance;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getBalance = async (req, res) => {

  const userId = req.param.userId;
  const cacheKey = `user_balance_${userId}`;
  try {
    const cachedBalance = await redisClient.get(cacheKey);
    if (cachedBalance) {
      return JSON.parse(cachedBalance);
    } else {
      const balance = await Balance.sum('amount', { where: { userId } });
      await redisClient.set(cacheKey, JSON.stringify(balance), 'EX', 3600);
      return balance;
    }
  } catch (err) {
    console.error('Error fetching user balance:', err);
    throw err;
  }
}

module.exports = { getBalance, setBalance };