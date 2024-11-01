
require('dotenv').config();
const fs = require('node:fs');

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: `https://localhost:9200/`,
  // node: `https://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}/`,
  auth: {
    apiKey: "RnI0ZjRwSUJxYnlSMU9fQmRZVVo6OE43OU9VRTZSMVdQTWh4NHlMSFBnUQ==",
  },

  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false
  }
});




module.exports = client 