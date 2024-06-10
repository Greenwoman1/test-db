const express = require('express');
const path = require('path'); // Add this line
const bodyParser = require('body-parser'); // Add this line
const sequelize = require('./sequelize');
const User = require('./src/routes/users');
const Product = require('./src/routes/product');
const categoryRoutes = require('./src/routes/category');
const orderItemRoutes = require('./src/routes/orderItems');
const orderDetailsRoutes = require('./src/routes/orderDetails');
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
// app.use('/categories', Category);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        // Database synchronization
        await sequelize.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error while working with the database:', error);
    }
});
