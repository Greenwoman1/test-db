// variantRouter.js
const express = require('express');
const router = express.Router();
const variantController = require('./variantController');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = (io) => {
  router.get('/avilable', (req, res) => variantController.getAvilableVariants(req, res, io));
  router.get('/:variantId/locations', (req, res) => variantController.getVariantLocations(req, res, io));
  router.get('/:variantLocationId/addons', (req, res) => variantController.getVariantAddons(req, res, io));
  router.get('/:variantLocationId/ingredient', (req, res) => variantController.getVariantLocationIngredient(req, res, io));
  
  router.post('/upload/:variantId', upload.array("images"), (req, res) => variantController.uploadImage(req, res, io));

  return router;
};
