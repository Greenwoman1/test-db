const redisClient = require('../../../redisClient');
const sequelize = require('../../../sequelize');
const { Balance } = require('../../index');

const getBalance = async (userId) => {
  const cacheKey = `user_balance_${userId}`;
  try {
    const cachedBalance = await redisClient.get(cacheKey);
    if (cachedBalance) {

      const balance = await Balance.sum('amount', { where: { UserId: userId } });
      if (balance !== cachedBalance) {

        await redisClient.set(cacheKey, JSON.stringify(balance), 'EX', 3600);
        return balance;
      }
      return JSON.parse(cachedBalance);
    } else {
      const balance = await Balance.sum('amount', { where: { UserId: userId } });
      await redisClient.set(cacheKey, JSON.stringify(balance), 'EX', 3600);
      return balance;
    }
  } catch (err) {
    console.error('Error fetching user balance:', err);
    throw err;
  }
};


const setBalance = async (userId, amount, reason = 'Initial Balance', comment = 'New balance added', refId = "") => {
  const result = await sequelize.transaction(async (t) => {
    const newBalance = await Balance.create({
      UserId: userId,
      amount,
      date: new Date(),
      reason: 'Initial Balance',
      comment: 'New balance added',
      refid: refId
    }, { transaction: t });

    const totalBalance = await Balance.sum('amount', { where: { UserId: userId }, transaction: t });

    await redisClient.set(`user_balance_${userId}`, JSON.stringify(totalBalance), 'EX', 36000);

    return totalBalance;

  });
};




module.exports = { getBalance, setBalance };