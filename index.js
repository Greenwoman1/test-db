const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./sequelize');
const variantRoute = require('./src/Variant/variantRoute');
const productRoute = require('./src/Product/productRoute');
const skuRoute = require('./src/SKU/SKURoute');
const skuRuleRoute = require('./src/SKURule/SKURuleRoute');
const toponsRoute = require('./src/Topons/toponsRoute');
const userRoute = require('./src/User/userRoute');
const groupRuleRoute = require('./src/GroupRule/groupRoute');
const locationRoute = require('./src/Location/locationRoute');
const comboRoute = require('./src/Combo/comboRoute');
const { seed } = require('./src/seed');
const init = require('./helpers/initModels');
const cors = require('cors');

const multer = require("multer");

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

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/variant', variantRoute);
app.use('/groupRules', groupRuleRoute);
app.use('/sku', skuRoute);
app.use('/skuRule', skuRuleRoute);
app.use('/topons', toponsRoute);
app.use('/locations', locationRoute);
app.use('/combo', comboRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {

    await init();
    await sequelize.sync({/*  force: true */ });

    // await seed();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error while working with the database:', error);
  }
});



