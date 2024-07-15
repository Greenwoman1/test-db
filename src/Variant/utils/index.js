const Location = require("../../Location/Location")
const SKU = require("../../SKU/SKU")
const Variant = require("../Variant")

const getVariantSKU = async (variant, location) => {
  const sku = await Variant.findByPk(variant, {
    include: [
      {
        model: Location,
        where: {
          id: location
        },
        include: [
          {
            model: SKU,
            attributes: ['stock']
          }
        ]
      }
    ]
  })


  return Number(sku.Locations[0].SKUs[0].stock)
}

module.exports = { getVariantSKU }