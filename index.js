const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./sequelize');
const User = require('./src/routes/users');
const Product = require('./src/routes/product');
const categoryRoutes = require('./src/routes/category');
const orderItemRoutes = require('./src/routes/orderItems');
const orderDetailsRoutes = require('./src/routes/orderDetails');
const authRoutes = require('./src/routes/auth');


const { createProduct, addVariants, addGroupOptions, addOptionsToGroup, addTopons, createCombo, getVariantDetails, getComboDetails } = require('./src/seed');

// const Category = require('./src/models/Category'); // Correct this line

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Error connecting to database:', err));

app.use(express.json());


app.use('/users', User);
app.use('/products', Product);
app.use('/categories', categoryRoutes);
app.use('/orderItems', orderItemRoutes);
app.use('/orderDetails', orderDetailsRoutes);
app.use('/auth', authRoutes)
// app.use('/categories', Category);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await sequelize.sync( {force: true} );
        const product1 = await createProduct('Kafa');
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
        console.log("Database populated successfully!");
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error while working with the database:', error);
    }
});



