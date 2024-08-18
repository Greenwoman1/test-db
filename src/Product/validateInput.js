const { body, param, validationResult } = require('express-validator');

const validateProduct = [
  body('name')
    .isString().withMessage('Product name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('Product name must be between 1 and 64 characters'),
  body('type')
    .isIn(['single', 'combo']).withMessage('Product type must be either "single" or "combo"'),
  body('description')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters'),
  body('CategoryId')
    .isUUID(4).withMessage('Invalid CategoryId format'),

  body('variants')
    .isArray({ min: 1 }).withMessage('Variants must be a non-empty array'),
  body('variants.*.name')
    .isString().withMessage('Variant name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('Variant name must be between 1 and 64 characters'),

  body('variants.*.locations')
    .isArray({ min: 1 }).withMessage('Locations must be a non-empty array'),
  body('variants.*.locations.*.LocationId')
    .isUUID(4).withMessage('Invalid LocationId format'),
  body('variants.*.locations.*.skuRules')
    .optional().isObject().withMessage('skuRules must be an object'),

  body('variants.*.locations.*.skuRules.name')
    .if(body('variants.*.locations.*.skuRules').exists())
    .isString().withMessage('SKU name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('SKU name must be between 1 and 64 characters'),

  body('variants.*.locations.*.skuRules.unit')
    .if(body('variants.*.locations.*.skuRules').exists())
    .isInt({ min: 1 }).withMessage('Unit must be an integer greater than 0'),

  body('variants.*.locations.*.skuRules.quantity')
    .if(body('variants.*.locations.*.skuRules').exists())
    .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),

  body('variants.*.locations.*.skuRules.disabled')
    .if(body('variants.*.locations.*.skuRules').exists())
    .isBoolean().withMessage('Disabled must be a boolean value'),

  body('variants.*.locations.*.skuRules.SKUId')
    .if(body('variants.*.locations.*.skuRules').exists())
    .isUUID(4).withMessage('Invalid SKUId format'),
  // Ingredients validation
  body('variants.*.locations.*.ingredients')
    .optional().isArray({ min: 0 }).withMessage('Ingredients must be an array'),

  body('variants.*.locations.*.ingredients.*.id')
    .if(body('variants.*.locations.*.ingredients').exists())
    .isUUID().withMessage('Invalid ingredient id format'),

  body('variants.*.locations.*.ingredients.*.quantity')
    .if(body('variants.*.locations.*.ingredients').exists())
    .isInt({ min: 1 }).withMessage('Ingredient quantity must be an integer greater than 0'),

  body('variants.*.locations.*.ingredients.*.skuRules')
    .if(body('variants.*.locations.*.ingredients').exists())
    .isObject().withMessage('Ingredient skuRules must be an object'),

  // Topons validation
  body('variants.*.locations.*.topons')
    .optional().isObject().withMessage('Topons must be an object'),

  body('variants.*.locations.*.topons.interfaceRules')
    .if(body('variants.*.locations.*.topons').exists())
    .isString().withMessage('interfaceRules must be a string'),

  body('variants.*.locations.*.topons.topons')
    .if(body('variants.*.locations.*.topons').exists())
    .isArray({ min: 0 }).withMessage('Topons must be an array'),

  body('variants.*.locations.*.topons.topons.*.ToponId')
    .if(body('variants.*.locations.*.topons').exists())
    .isUUID().withMessage('Invalid ToponId format'),

  body('variants.*.locations.*.topons.topons.*.minTopon')
    .if(body('variants.*.locations.*.topons').exists())
    .isInt({ min: 0 }).withMessage('minTopon must be a non-negative integer'),

  body('variants.*.locations.*.topons.topons.*.maxTopon')
    .if(body('variants.*.locations.*.topons').exists())
    .isInt({ min: 0 }).withMessage('maxTopon must be a non-negative integer'),

  body('variants.*.locations.*.topons.topons.*.skuRules')
    .if(body('variants.*.locations.*.topons').exists())
    .isObject().withMessage('Topon skuRules must be an object'),

  // Options validation
  body('variants.*.locations.*.options')
    .optional().isArray({ min: 0 }).withMessage('Options must be an array'),

  body('variants.*.locations.*.options.*.name')
    .if(body('variants.*.locations.*.options').exists())
    .isString().withMessage('Option name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('Option name must be between 1 and 64 characters'),

  body('variants.*.locations.*.options.*.rules')
    .if(body('variants.*.locations.*.options').exists())
    .isString().withMessage('Option rules must be a string'),

  body('variants.*.locations.*.options.*.options')
    .if(body('variants.*.locations.*.options').exists())
    .isArray().withMessage('Options must be an array of UUIDs'),

  body('variants.*.locations.*.options.*.options.*')
    .if(body('variants.*.locations.*.options').exists())
    .isString().withMessage('Invalid optionId format'),

  // ComboItems validation
  body('variants.*.locations.*.comboItems')
    .optional().isArray({ min: 0 }).withMessage('ComboItems must be an array'),

  body('variants.*.locations.*.comboItems.*.VariantLocationId')
    .if(body('variants.*.locations.*.comboItems').exists())
    .isUUID(4).withMessage('Invalid VariantLocationId format'),

  body('variants.*.locations.*.comboItems.*.quantity')
    .if(body('variants.*.locations.*.comboItems').exists())
    .isInt({ min: 1 }).withMessage('ComboItem quantity must be an integer greater than 0'),

];


const validateProductId = [
  param('productId')
    .isUUID(4).withMessage('Invalid productId format')
    .isLength({ min: 4, max: 64 }).withMessage('productId must be between 4 and 64 characters'),
];


const validateLocationId = [
  param('locationId')
    .isUUID(4).withMessage('Invalid locationId format')
    .isLength({ min: 4, max: 64 }).withMessage('locationId must be between 4 and 64 characters'),

];

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { validateProduct, validateResult, validateProductId, validateLocationId };
