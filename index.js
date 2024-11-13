const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const sequelize = require('./clients/sequelize');
const redisClient = require('./clients/redisClient');
const mainRouter = require('./src/router');
const { seed, test, seedRoles, seedProducts } = require('./src/seed');
const init = require('./helpers/initModels');
const cors = require('cors');
const multer = require("multer");
const client = require('./clients/elastics');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.json());

// Proslijedi `io` Socket.IO instancu u rute

// Ostale rute...
app.use('/api/v2', mainRouter(io));

// Socket.IO logika
io.on("connection", (socket) => {
  const role = socket.handshake.auth.role;

  if (role === 'admin') {
    socket.join('admins');
  } else {
    socket.join('users');
  }

  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Redis test route
app.get('/redis-test', (req, res) => {
  redisClient.set('test', 'This is a test', 'EX', 10, (err, reply) => {
    if (err) return res.status(500).send('Error setting Redis key');
    redisClient.get('test', (err, reply) => {
      if (err) return res.status(500).send('Error getting Redis key');
      res.send(`Redis key value: ${reply}`);
    });
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await init();
    await sequelize.sync({ force: false });
    const { Client } = require('@elastic/elasticsearch');
    const client = new Client({ node: 'http://localhost:9200' });
    
    // async function createOrdersIndex() {
    //   try {
    //     await client.indices.create({
    //       index: 'orders',
    //       body: {
    //         mappings: {
    //           properties: {
    //             userId: { type: 'keyword' },
    //             locationId: { type: 'keyword' },
    //             force: { type: 'boolean' },
    //             items: {
    //               type: 'nested',
    //               properties: {
    //                 productName: { type: 'text' },
    //                 productId: { type: 'keyword' },
    //                 variant: {
    //                   properties: {
    //                     id: { type: 'keyword' },
    //                     name: { type: 'text' }
    //                   }
    //                 },
    //                 options: {
    //                   type: 'nested',
    //                   properties: {
    //                     id: { type: 'keyword' },
    //                     name: { type: 'text' }, // Polje name definisano kao `text`
    //                     GroupOptionId: { type: 'keyword' }
    //                   }
    //                 },
    //                 topons: {
    //                   type: 'nested',
    //                   properties: {
    //                     id: { type: 'keyword' },
    //                     name: { type: 'text' },
    //                     quantity: { type: 'integer' }
    //                   }
    //                 },
    //                 id: { type: 'keyword' },
    //                 quantity: { type: 'integer' }
    //               }
    //             },
    //             totalPrice: { type: 'float' },
    //             id: { type: 'keyword' },
    //             status: { type: 'text' }
    //           }
    //         }
    //       }
    //     });
    
    //     console.log('Index "orders" created successfully.');
    //   } catch (error) {
    //     console.error('Error creating index:', error);
    //   }
    // }
    
    // await createOrdersIndex();
    
    // client.indices.create({ index: 'orders' });
    // client.indices.create({ index: 'products' });
    // client.indices.create({ index: 'users' });

    // await seedProducts();
    // await seed();
    // await seedRoles();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error while working with the database:', error);
  }
});
