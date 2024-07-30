const { Variant, Price, SKU, Location, VariantLocations, VariantIngredients, IngredientLocations, Ingredients } = require('../index');
const { Image } = require('../index');



const getVariantLocations = async (req, res) => {
  const variantId = req.params.variantId;
  try {
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      res.status(404).json({ message: "Variant not found" });
      return;
    }

    const locations = await Variant.findAll({
      where: { id: variantId },
      include: [
        { model: Location, attributes: ['id', 'name'], through: { attributes: [] } },
      ]
    });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }


}


const getVariantAddons = async (req, res) => {
  const variantLocationId = req.params.variantLocationId;

  try {
    const variantLocation = await VariantLocations.findOne({
      where: { id: variantLocationId },

      attributes: ['id'],
      as: 'VL',
      include: [
        {
          model: GroupOptions,
          required: false,
          attributes: ['name', 'rules'],
          include: [
            {
              model: Option,
              attributes: ['name']
            }
          ]
        },
        {
          model: GroupTopon,
          required: false,
          attributes: ['id'],
          include: [
            {
              model: GroupToponsMid,
              attributes: ['id'],
              include: [
                {
                  model: ToponLocations,
                  attributes: ['id'],
                  include: [
                    {
                      as: 'TL',
                      model: Topons,
                      attributes: ['name']

                    }
                  ]
                }
              ]

            }

          ]

        }

      ]

    });

    if (!variantLocation) {
      res.status(404).json({ message: "Variant location not found" });
      return;
    }

    res.status(200).json(variantLocation);

  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
}


const getVariantLocationIngredients = async (req, res) => {
  const variantLocationId = req.params.variantLocationId;
  try {
    const ingredients = await VariantLocations.findAll({
      logging: console.log,
      where: { id: variantLocationId },
      include: [{ model: VariantIngredients, include: [{ model: IngredientLocations, include: [{ model: Ingredients, as: 'IL' }] }] }]
    })


    res.status(200).json(ingredients);

  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }

}

const getAviableVariants = async (req, res) => {
  try {
    const availableVariants = await Variant.findAll({
      logging: console.log,
      attributes: [
        'id',
        'name',
        [literal('"VL->Location"."name"'), 'Location']],
      include: [
        {
          model: VariantLocations,
          attributes: [],
          as: 'VL',
          include: [
            {
              model: Location,
              attributes: [],
              required: true
            },


          ]
        }
      ],

    });


    res.status(200).json(availableVariants);

  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
}

// #region image, price

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

// #endregion

module.exports = {
  getVariantLocations,
  getVariantAddons,
  getVariantLocationIngredients,
  getAviableVariants,
  uploadImage,
  getPrice,
  setPrice

};
