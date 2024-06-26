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


router.post('/', variantController.createVariant);
router.get('/', variantController.getVariants);
router.get('/:id', variantController.getVariantById);
router.put('/:id', variantController.updateVariant);
router.delete('/:id', variantController.deleteVariant);


router.post('/upload/:variantId', upload.array("images"), variantController.uploadImage);

module.exports = router;
