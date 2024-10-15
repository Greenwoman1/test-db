// routes/index.js
const express = require('express');
const userRouter = require('./User/router');
const productRouter = require('./Product/router');
const orderRouter = require('./Order/router');
const variantRouter = require('./Variant/router');
const toponsRouter = require('./Topon/router');

const authRouter  = require('./Auth/route');
const { authentication } = require('./Auth/utils');
// const seedRouter = require('./Seed/router').seedRoute;

const mainRouter = express.Router();


// Define the routes
mainRouter.use('/user', authentication, userRouter);
mainRouter.use('/product', authentication, productRouter);
mainRouter.use('/order', authentication,  orderRouter);
mainRouter.use('/variant', authentication, variantRouter);
mainRouter.use('/topon', authentication, toponsRouter);
mainRouter.use('/auth', authRouter);
// mainRouter.use('/seed', seedRouter);

module.exports = mainRouter;
