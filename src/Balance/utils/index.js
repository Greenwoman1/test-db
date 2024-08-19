const createError = require('../../../helpers/customError');
const {redisClient} = require('../../../clients/redisClient');
const sequelize = require('../../../clients/sequelize');
const { Balance } = require('../../index');


const getBalance = async (userId) => {
  const cacheKey = `user_balance_${userId}`;
  try {
    const cachedBalance = await redisClient.get(cacheKey);
    if (cachedBalance) {
      const balance = await Balance.sum('amount', { where: { UserId: userId } });
      if (balance === null || isNaN(balance)) {
        console.error(`No balance found for user with ID: ${userId}`);
        throw createError(`No balance found for user with ID: ${userId}`, 401);
      }

      if (balance !== parseFloat(cachedBalance)) {
        await redisClient.set(cacheKey, JSON.stringify(balance), 'EX', 3600);
        return balance;
      }
      return JSON.parse(cachedBalance);
    } else {
      const balance = await Balance.sum('amount', { where: { UserId: userId } });
      if (balance === null || isNaN(balance)) {
        throw createError(`No balance found for user with ID: ${userId}`, 401);
      }

      await redisClient.set(cacheKey, JSON.stringify(balance), 'EX', 3600);
      return balance;
    }
  } catch (err) {
    console.error('Error fetching user balance:', err);
    throw err;
  }
};


const setBalance = async (userId, amount, reason = 'Initial Balance', comment = 'New balance added', refId = "" ) => {
  const cacheKey = `user_balance_${userId}`;

  try {
    const result = await sequelize.transaction(async (t) => {
      const newBalance = await Balance.create({
        UserId: userId,
        amount,
        date: new Date(),
        reason,
        comment,
        refid: refId
      }, { transaction: t });

      const totalBalance = await Balance.sum('amount', { where: { UserId: userId }, transaction: t });
      if (totalBalance === null || isNaN(totalBalance)) {
        throw createError(`No balance found for user with ID: ${userId}`, 401);
      }

      await redisClient.set(cacheKey, JSON.stringify(totalBalance), 'EX', 36000);

      return totalBalance;
    });

    return result;

  } catch (err) {
    console.error('Error fetching user balance:', err);
    throw err;
  }
};



module.exports = { getBalance, setBalance };