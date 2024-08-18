// routes/index.js
const express = require('express');
const userRouter = require('./User/router');
const productRouter = require('./Product/router');
const orderRouter = require('./Order/router');
const variantRouter = require('./Variant/router');
const toponsRouter = require('./Topon/router');
// const seedRouter = require('./Seed/router').seedRoute;

const mainRouter = express.Router();


// Define the routes
mainRouter.use('/user', userRouter);
mainRouter.use('/product', productRouter);
mainRouter.use('/order', orderRouter);
mainRouter.use('/variant', variantRouter);
mainRouter.use('/topon', toponsRouter);
// mainRouter.use('/seed', seedRouter);

module.exports = mainRouter;
