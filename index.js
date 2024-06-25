const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./sequelize');
const variantRoute = require('./src/Variant/variantRoute'); // Dodajte ovu liniju
const comboItemRoute = require('./src/ComboItem/comboItemRoute');
const productRoute = require('./src/Product/productRoute');
const skuRoute = require('./src/SKU/SKURoute');
const skuRuleRoute = require('./src/SKURule/SKURuleRoute');
const toponsRoute = require('./src/Topons/toponsRoute');
const userRoute = require('./src/User/userRoute');
const groupRuleRoute = require('./src/GroupRule/groupRoute');
const { seed } = require('./src/seed');
const init = require('./helpers/initModels');
const { createProduct, addVariants, addGroupOptions, addOptionsToGroup, addTopons, createCombo, getVariantDetails, getComboDetails } = require('./src/seed');
const { createPancakesProduct, getPancakesSettings, createProducts, getProductSettings } = require('./helpers/query');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Error connecting to database:', err));

app.use(express.json());

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/variant', variantRoute);
app.use('/comboItems', comboItemRoute);
app.use('/groupRules', groupRuleRoute);
app.use('/sku', skuRoute);
app.use('/skuRule', skuRuleRoute);
app.use('/topons', toponsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {

        await init();
        await sequelize.sync(/* { force: true } */);

    //    await seed(); 
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error while working with the database:', error);
    }
});



