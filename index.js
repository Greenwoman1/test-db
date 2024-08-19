const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./clients/sequelize');
// // const client = require('./elastics');
// const variantRoute = require('./src/Variant/variantRoute');
// const productRoute = require('./src/Product/productRoute');
// // const skuRoute = require('./src/SKU/SKURoute');
// const toponsRoute = require('./src/Topon/toponRoute');
// const userRoute = require('./src/User/userRoute');
// const groupRuleRoute = require('./src/GroupRule/groupRoute');
// const locationRoute = require('./src/Location/locationRoute');
// const comboRoute = require('./src/Combo/comboRoute');
// const orderRoute = require('./src/Order/route');
const redisClient = require('./clients/redisClient');

const mainRouter = require('./src/router');

const { seed, test, seedRoles, seedProducts } = require('./src/seed');
const init = require('./helpers/initModels');
const cors = require('cors');

const multer = require("multer");
const client = require('./clients/elastics');

const app = express();
app.use(cors());


app.use(express.static(path.join(__dirname, 'public/images')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});


sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Error connecting to database:', err));

app.use(express.json());
/// u router file 
// app.use('/user', userRoute);
// app.use('/product', productRoute);
// app.use('/order', orderRoute);
// app.use('/variant', variantRoute);
// app.use('/topon', toponsRoute);
// app.use('/seed', seed);



app.use('/api/v2', mainRouter);
/// app.use(/, router )

app.get('/redis-test', (req, res) => {
  redisClient.set('test', 'This is a test', 'EX', 10, (err, reply) => {
    if (err) {
      return res.status(500).send('Error setting Redis key');
    }
    redisClient.get('test', (err, reply) => {
      if (err) {
        return res.status(500).send('Error getting Redis key');
      }
      res.send(`Redis key value: ${reply}`);
    });
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {

    await init();
    await sequelize.sync({ force: false });


  

    async function createIndex() {
      const indexName = 'products';
    
      try {
        // Check if the index already exists
        const { body: exists } = await client.indices.exists({ index: indexName });
    
        if (!exists) {
          // Create the index with custom settings
          await client.indices.create({
            index: indexName,
            body: {
              settings: {
                number_of_shards: 1,           // Number of primary shards
                number_of_replicas: 1,         // Number of replica shards
                analysis: {                    // Custom analysis settings (e.g., custom analyzers)
                  analyzer: {
                    // my_custom_analyzer: {
                    //   type: 'custom',
                    //   tokenizer: 'standard',
                    //   filter: ['lowercase', 'asciifolding']
                    // }
                  }
                }
              },
              mappings: {
                "_source": { "enabled": true },
                properties: {
                  name: { type: 'text'/* , analyzer: 'my_custom_analyzer' */ }, // Using the custom analyzer
                  description: { type: 'text' },
                  type: { type: 'text' },
                  CategoryId: { type: 'text' },
                  LocationIds: { type: 'keyword' }  // Array of keyword types
                }
              }
            }
          });
    
          console.log(`Index "${indexName}" created successfully.`);
        } else {
          console.log(`Index "${indexName}" already exists.`);
        }
      } catch (error) {
        console.error('Error creating index:', error);
      }
    }
    

    /// DA NIJE NA SAVE 
    // await createIndex('products');

    // await client.index({
    //   index: "products",
    //   id: 'fdsfdsfds',
    //   document : {}
    // });

    // await createIndex("products");
    
    const info = await client.info();
    // console.log(info);

    // await createIndex("posts");
// await seedProducts();
//     await seed();
//     await seedRoles();
    // await test();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error while working with the database:', error);
  }
});




