const sequelize = require('../../sequelize');
const { Variant, Topon, Option, GroupRule, Product, Location, Image, VariantTopons, VariantLocation, GroupOptions, GroupTopons, PriceHistory, Combo, ComboItems, SKU } = require('../index');

const { createProductHelper } = require('./utils/index');


const list = async (req, res) => {
  try {
    const products = await Product.findAll({ attributes: ['id', 'name', 'description', 'type'] });
    return res.status(200).json(products);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createProduct = async (req, res) => {
  try {
    const product = await createProductHelper(req.body);
    console.log(product);
    return res.status(201).json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getProductById = async (req, res) => {

  console.log(req.params)
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId, {
      attributes: ['id', 'name', 'description', 'type'],
    });
    return res.status(200).json(product);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getProductVariants = async (req, res) => {
  try {
    const productId = req.params.productId;
    const variants = await Variant.findAll({
      where: { ProductId: productId },
      attributes: ['id', 'name'],
    });
    return res.status(200).json(variants);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getProductVariantLocation = async (req, res) => {

  try {

    const productId = req.params.productId;
    const locationId = req.params.locationId;

 console.log(productId, locationId)
    const variants = await Variant.findAll({
      where: { ProductId: productId },
      attributes: ['id', 'name'],
      include: [
        {
          model: VariantLocation,
          as: 'VarLoc',
          where: { LocationId: locationId },
          attributes: ['id'],
        },
      ],
    });

    console.log(variants);

    return res.status(200).json(variants);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getProductsAtLocation = async (req, res) => {

  const locationId = req.params.locationId;
  console.log(locationId)

  try {
    const products = await Product.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Variant,
        attributes: ['id', 'name'],
        include: [{

          model: VariantLocation,
          as: 'VarLoc',
          attributes: ['id'],
          where: { LocationId: locationId }
        }]
      }]
    })

    console.log(products)
    return res.status(200).json(products);
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

}






module.exports = { list, getProductById, getProductVariants, getProductVariantLocation, getProductsAtLocation, createProduct }