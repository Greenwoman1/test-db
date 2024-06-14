const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./sequelize');
const variantRoute = require('./src/Variant/variantRoute'); // Dodajte ovu liniju
const comboRoute = require('./src/Combo/comboRoute');
const comboItemRoute = require('./src/ComboItem/comboItemRoute');
const productRoute = require('./src/Product/productRoute');
const skuRoute = require('./src/SKU/SKURoute');
const skuRuleRoute = require('./src/SKURule/SKURuleRoute');
const toponsRoute = require('./src/Topons/toponsRoute');
const userRoute = require('./src/User/userRoute');
const groupRuleRoute = require('./src/GroupRule/groupRoute');

const init = require('./helpers/initModels');
const { createProduct, addVariants, addGroupOptions, addOptionsToGroup, addTopons, createCombo, getVariantDetails, getComboDetails } = require('./src/seed');
const { createPancakesProduct, getPancakesSettings } = require('./helpers/query');


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
app.use('/combo', comboRoute);
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
        await sequelize.sync({ force: true });

        await createPancakesProduct();

        await getPancakesSettings().then(settings => {
            console.log('Palačinke settings:', JSON.stringify(settings, null, 2));
        }).catch(error => {
            console.error('Error:', error);
        });

        /*     const product1 = await createProduct('Kafa');
            const product2 = await createProduct('Cokoladica');
    
            const variantsData = [
                { name: 'esspreso' },
                { name: 'dzezva' }
            ];
            const addedVariants = await addVariants(product1.id, variantsData);
    
            const groupOptionsData = [
                { name: 'Duzina' },
                { name: 'Solja' }
            ];
            const addedGroupOptions = await addGroupOptions(addedVariants[0].id, groupOptionsData);
    
            const optionsData = [
                { name: 'Duza' },
                { name: 'Kraca' }
            ];
            const addedOptions = await addOptionsToGroup(addedGroupOptions[0].id, optionsData);
    
            const toponsData = [
                { name: 'secer', quantity: 10 },
                { name: 'Mlijeko' ,quantity: 10 }
            ];
            const addedTopons = await addTopons(addedVariants[0].id, toponsData);
    
            const comboData = { name: 'kafa + cokoladica' , ProductId: product1.id };
            const variantIds = addedVariants.map(variant => variant.id);7
    
            const createdCombo = await createCombo(product1.id, comboData, variantIds);
    
            
            const variantDetails = await getVariantDetails(addedVariants[0].id);
    
            const ComboDetails = await getComboDetails(createdCombo.id);
            console.log(JSON.stringify(ComboDetails, null, 2));
            console.log("Database populated successfully!"); */
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error while working with the database:', error);
    }
});



