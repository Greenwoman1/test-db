require('dotenv').config();


const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
console.log(env)
const config = require(__dirname + '/../config/config.json')[env];
console.log(config)
const sequelize = new Sequelize(config.database, config.username, config.password, config);


module.exports = sequelize