// routes/index.js
const express = require('express');
const userRouter = require('./User/router');
const productRouter = require('./Product/router');
const orderRouter = require('./Order/router');
const variantRouter = require('./Variant/router');
const toponsRouter = require('./Topon/router');
const locationRouter = require('./Location/router');
const categoryRouter = require('./Category/router');
const cartRouter = require('./Cart/router');
const authRouter = require('./Auth/route');
const skuRouter = require('./SKU/router');
const { authentication } = require('./Auth/utils');
// const seedRouter = require('./Seed/router').seedRoute;

module.exports = (io) => {
  const mainRouter = express.Router();

  mainRouter.use('/user', authentication, userRouter(io));
  mainRouter.use('/product', authentication, productRouter(io));
  mainRouter.use('/cart', authentication, cartRouter(io));
  mainRouter.use('/order', authentication, orderRouter(io));
  mainRouter.use('/variant', authentication, variantRouter(io));
  mainRouter.use('/topon', authentication, toponsRouter(io));
  mainRouter.use('/location', authentication, locationRouter(io));
  mainRouter.use('/category', authentication, categoryRouter(io));
  mainRouter.use('/sku', authentication, skuRouter(io));
  mainRouter.use('/auth', authRouter);

  return mainRouter;
};