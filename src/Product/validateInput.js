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
    .isObject().withMessage('skuRules must be an object'),
  body('variants.*.locations.*.skuRules.name')
    .isString().withMessage('SKU name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('SKU name must be between 1 and 64 characters'),
  body('variants.*.locations.*.skuRules.unit')
    .isInt({ min: 1 }).withMessage('Unit must be an integer greater than 0'),
  body('variants.*.locations.*.skuRules.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
  body('variants.*.locations.*.skuRules.disabled')
    .isBoolean().withMessage('Disabled must be a boolean value'),
  body('variants.*.locations.*.skuRules.SKUId')
    .isUUID(4).withMessage('Invalid SKUId format'),

  body('variants.*.locations.*.ingredients')
    .isArray({ min: 0 }).withMessage('Ingredients must be an array'),
  body('variants.*.locations.*.ingredients.*.id')
    .isUUID().withMessage('Invalid ingredient id format'),
  body('variants.*.locations.*.ingredients.*.quantity')
    .isInt({ min: 1 }).withMessage('Ingredient quantity must be an integer greater than 0'),
  body('variants.*.locations.*.ingredients.*.skuRules')
    .isObject().withMessage('Ingredient skuRules must be an object'),

  body('variants.*.locations.*.topons')
    .isObject().withMessage('Topons must be an object'),
  body('variants.*.locations.*.topons.interfaceRules')
    .isString().withMessage('interfaceRules must be a string'),
  body('variants.*.locations.*.topons.topons')
    .isArray({ min: 0 }).withMessage('Topons must be an array'),
  body('variants.*.locations.*.topons.topons.*.ToponId')
    .isUUID().withMessage('Invalid ToponId format'),
  body('variants.*.locations.*.topons.topons.*.minTopon')
    .isInt({ min: 0 }).withMessage('minTopon must be a non-negative integer'),
  body('variants.*.locations.*.topons.topons.*.maxTopon')
    .isInt({ min: 0 }).withMessage('maxTopon must be a non-negative integer'),
  body('variants.*.locations.*.topons.topons.*.skuRules')
    .isObject().withMessage('Topon skuRules must be an object'),

  body('variants.*.locations.*.options')
    .isArray({ min: 0 }).withMessage('Options must be an array'),
  body('variants.*.locations.*.options.*.name')
    .isString().withMessage('Option name must be a string')
    .isLength({ min: 1, max: 64 }).withMessage('Option name must be between 1 and 64 characters'),
  body('variants.*.locations.*.options.*.rules')
    .isString().withMessage('Option rules must be a string'),
  body('variants.*.locations.*.options.*.options')
    .isArray().withMessage('Options must be an array of UUIDs'),
  body('variants.*.locations.*.options.*.options.*')
    .isUUID().withMessage('Invalid optionId format'),

  body('variants.*.locations.*.comboItems')
    .isArray({ min: 0 }).withMessage('ComboItems must be an array'),
  body('variants.*.locations.*.comboItems.*.VariantLocationId')
    .isUUID(4).withMessage('Invalid VariantLocationId format'),
  body('variants.*.locations.*.comboItems.*.quantity')
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
