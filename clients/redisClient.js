const Redis = require('ioredis');
const { promisify } = require('util');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',  
  port: process.env.REDIS_PORT || 6390,     
});
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Promisifikacija 'set' metode
const setAsync = promisify(redisClient.set).bind(redisClient);

module.exports = {
  redisClient,
  setAsync
};
