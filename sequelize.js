const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'user', 'password', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize