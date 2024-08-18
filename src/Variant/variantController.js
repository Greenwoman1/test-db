const { literal, Op } = require('sequelize');
const { Variant, Price, SKU, Location, VariantLocation, VariantIngredient, IngredientLocation, Ingredient, GroupTopon, GroupToponsMid, ToponLocation, GroupOptions, Option, Topon, Image, VariantSKURule, IngredientSKURule } = require('../index');

const checkVariantExists = async (variantId) => {
  const variant = await Variant.findByPk(variantId);
  if (!variant) {
    throw new Error(`Variant with ID (${variantId}) not found`);
  }
  return variant;
};

const checkVariantLocationExists = async (variantLocationId) => {
  const variantLocation = await VariantLocation.findByPk(variantLocationId);
  if (!variantLocation) {
    throw new Error(`Variant location with ID (${variantLocationId}) not found`);
  }
  return variantLocation;
};

const getVariantLocations = async (req, res) => {
  const variantId = req.params.variantId;
  try {
    await checkVariantExists(variantId);

    const locations = await Variant.findAll({
      where: { id: variantId },
      include: [
        { model: Location, attributes: ['id', 'name'], through: { attributes: [] } },
      ]
    });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVariantAddons = async (req, res) => {
  const variantLocationId = req.params.variantLocationId;

  try {
    await checkVariantLocationExists(variantLocationId);

    const variantLocation = await VariantLocation.findOne({
      where: { id: variantLocationId },
      attributes: ['id'],
      include: [
        {
          model: GroupOptions,
          required: false,
          attributes: ['name', 'rules'],
          include: [{ model: Option, attributes: ['name'] }]
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
                  model: ToponLocation,
                  attributes: ['id'],
                  include: [{ as: 'TopLoc', model: Topon, attributes: ['name'] }]
                }
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json(variantLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVariantLocationIngredient = async (req, res) => {
  const variantLocationId = req.params.variantLocationId;
  try {
    await checkVariantLocationExists(variantLocationId);

    const ing = await VariantLocation.findAll({
      logging: console.log,
      where: { id: variantLocationId },
      include: [
        {
          model: VariantIngredient,
          as: 'VarLocIng',
          include: [{ model: IngredientLocation, as: 'VarIng', include: [{ model: Ingredient, as: 'InLoc' }] }]
        }
      ]
    });

    res.status(200).json(ing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvilableVariants = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const availableVariants = await paginate(Variant, {
      page,
      limit,
      attributes: [
        'id',
        'name',
        [literal('"VarLoc->Location"."name"'), 'Location']
      ],
      include: [
        {
          model: VariantLocation,
          attributes: [],
          as: 'VarLoc',
          include: [
            {
              model: Location,
              attributes: [],
              required: true
            },
            {
              model: VariantSKURule,
              as: 'VarLocRule',
              attributes: [],
              required: false,
              where: { disabled: false },
              include: [
                {
                  model: SKU,
                  attributes: [],
                  required: true,
                  as: 'VSKU',
                  where: {
                    [Op.and]: [
                      { allowMinus: false },
                      { stock: { [Op.gt]: 0 } }
                    ]
                  }
                }
              ]
            },
            {
              model: VariantIngredient,
              required: false,
              attributes: [],
              as: 'VarLocIng',
              include: [
                {
                  model: IngredientSKURule,
                  attributes: [],
                  required: true,
                  as: 'VarIngRule',
                  include: [
                    {
                      model: SKU,
                      as: 'InSku',
                      attributes: [],
                      required: true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      where: {
        [Op.or]: [
          { '$VarLoc.VarLocRule.VSKU.id$': { [Op.ne]: null } },
          { '$VarLoc.VarLocIng.VarIngRule.InSku.id$': { [Op.ne]: null } }
        ]
      },
      group: ['Variant.id', 'Variant.name', 'VarLoc->Location.id', 'VarLoc->Location.name'],
      having: literal('COUNT(CASE WHEN "VarLoc->VarLocIng->VarIngRule"."disabled" = TRUE THEN 1 ELSE NULL END) = 0')
    });

    res.status(200).json(availableVariants);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const variantId = req.params.variantId;
    await checkVariantExists(variantId);

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
    res.status(500).json({ message: error.message });
  }
};

const getPrice = async (req, res) => {
  try {
    const { variantId } = req.params;
    const date = new Date();
    const variant = await checkVariantExists(variantId);

    const price = await variant.getPrice(date);
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setPrice = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { price } = req.body;
    const variant = await checkVariantExists(variantId);

    await Price.create({
      price,
      itemId: variantId
    });

    res.status(200).json({ message: 'Price set successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVariantLocations,
  getVariantAddons,
  getVariantLocationIngredient,
  getAvilableVariants,
  uploadImage,
  getPrice,
  setPrice
};
