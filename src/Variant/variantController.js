const { Variant, Price } = require('../index');
const { Image } = require('../index');
const createVariant = async (req, res) => {
  try {
    const { name } = req.body;
    const newVariant = await Variant.create({ name });
    res.status(201).json(newVariant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVariants = async (req, res) => {
  try {
    const variants = await Variant.findAll();
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVariantById = async (req, res) => {
  try {
    const variantId = req.params.id;
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVariant = async (req, res) => {
  try {
    const variantId = req.params.id;
    const { name } = req.body;
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    await variant.update({ name });
    res.status(200).json({ message: 'Variant updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const variantId = req.params.id;
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    await variant.destroy();
    res.status(200).json({ message: 'Variant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const variantId = req.params.variantId;

    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      res.status(401).json({ message: "Variant not found" });
      return;
    }

    const { name } = req.body;

    if (!req.files || req.files.length === 0) {
      res.status(400).send("No files uploaded");
      return;
    }

    const images = req.files.map(file => ({
      name,
      image: file.filename,
      VariantId: variantId
    }));

    const createdImages = await Image.bulkCreate(images);

    res.status(201).json({ createdImages, message: "Data uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
};


const getPrice = async (req, res) => {
  try {
    const { variantId } = req.params;
    const date = new Date();
    const variant = await Variant.findByPk(variantId);
    const price = await variant.getPrice(date);
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const setPrice = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { price } = req.body;
    const variant = await Variant.findByPk(variantId);

    await Price.create({
      price,
      itemId: variantId
    })
    res.status(200).json({ message: 'Price set successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createVariant,
  getVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
  uploadImage,
  getPrice,
  setPrice
};
