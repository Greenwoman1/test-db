
require('dotenv').config();
const fs = require('node:fs');

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: `https://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}/`,
  auth: {
    apiKey:  `${process.env.ELASTICSEARCH_API_KEY}`,
  },

  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false
  }
});


module.exports = client 