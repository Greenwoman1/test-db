const express = require('express');
const router = express.Router();
const variantController = require('./variantController');

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get('/avilable', variantController.getAvilableVariants);

router.get('/:variantId/locations', variantController.getVariantLocations);

router.get('/:variantLocationId/addons', variantController.getVariantAddons);

router.get('/:variantLocationId/ingredient', variantController.getVariantLocationIngredient);

router.post('/upload/:variantId', upload.array("images"), variantController.uploadImage);

module.exports = router;


