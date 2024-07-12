const SKU = require("../../SKU/SKU")
const Variant = require("../Variant")

const getVariantSKU = (variant, location) => {
  const sku = Variant.findByPk(variant, {
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
  return sku
}

module.exports = { getVariantSKU }