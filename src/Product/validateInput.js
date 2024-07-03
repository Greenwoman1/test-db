const { body, param, validationResult } = require('express-validator');


const validateCreateProduct = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name must not be empty')
    .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long')
    .isLength({ max: 64 }).withMessage('Name must be at most 64 characters long'),

  body('type')
    .optional()
    .isString().withMessage('Type must be a string')
    .isLength({ max: 16 }).withMessage('Type must be at most 16 characters long'),
  body('variants')
    .optional()
    .isArray().withMessage('Variants must be an array'),
  body('variants.*.name')
    .isString().withMessage('Variant name must be a string')
    .notEmpty().withMessage('Variant name must not be empty')
    .isLength({ min: 3 }).withMessage('Variant name must be at least 3 characters long')
    .isLength({ max: 64 }).withMessage('Variant name must be at most 64 characters long'),
  body('variants.*.groupOptions').isArray().withMessage('Group options must be an Array'),
  body('variants.*.groupOptions.*.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupOptions.*.type').isString().withMessage('Group option type must be a string'),
  body('variants.*.groupOptions.*.rules').isJSON().withMessage('Rules must be an JSON'),
  body('variants.*.groupOptions.*.options').isArray().withMessage('Options must be an Array'),
  body('variants.*.groupOptions.*.options.*').isString().withMessage('Options must be an Array'),
  body('variants.*.groupTopons').isArray().withMessage('Group topons must be an Array'),
  body('variants.*.groupTopons.*.name').isString().withMessage('Group topon name must be a string'),
  body('variants.*.groupTopons.*.type').isString().withMessage('Group topon type must be a string'),
  body('variants.*.groupTopons.*.rules').isJSON().withMessage('Rules must be an JSON'),
  body('variants.*.groupTopons.*.topons').isArray().withMessage('Rules must be an Array'),
  body('variants.*.groupTopons.*.topons.*.toponId').isUUID().withMessage('ToponId must be an UUID'),
  body('variants.*.groupTopons.*.topons.*.rules').isJSON().withMessage('Rules must be an JSON')


];

const validateCreateProductCombo = [
  body('name').isString().withMessage('Name must be a string'),
  body('description').isString().withMessage('Description must be a string'),
  body('type').isString().withMessage('Type must be a string'),
  body('variants').isArray().withMessage('Variants must be an array'),
  body('variants.*.name').isString().withMessage('Variant name must be a string'),
  body('variants.*.price').isDecimal().withMessage('Price must be a decimal'),
  body('variants.*.items').isArray().withMessage('Items must be an array'),
  body('variants.*.items.*').isUUID().withMessage('Item id must be a valid UUID'),

]
const validateUpdateProduct = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name must not be empty')
    .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long')
    .isLength({ max: 64 }).withMessage('Name must be at most 64 characters long'),

  body('type')
    .optional()
    .isString().withMessage('Type must be a string')
    .isLength({ max: 16 }).withMessage('Type must be at most 16 characters long'),
  body('variants')
    .optional()
    .isArray().withMessage('Variants must be an array'),
  body('variants.*.name')
    .isString().withMessage('Variant name must be a string')
    .notEmpty().withMessage('Variant name must not be empty')
    .isLength({ min: 3 }).withMessage('Variant name must be at least 3 characters long')
    .isLength({ max: 64 }).withMessage('Variant name must be at most 64 characters long'),
  body('variants.*.groupOptions').isArray().withMessage('Group options must be an Array'),
  body('variants.*.groupOptions.*.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupOptions.*.type').isString().withMessage('Group option type must be a string'),
  body('variants.*.groupOptions.*.rules').isJSON().withMessage('Rules must be an JSON'),
  body('variants.*.groupOptions.*.options').isArray().withMessage('Options must be an Array'),
  body('variants.*.groupOptions.*.options.*').isString().withMessage('Options must be an Array'),
  body('variants.*.groupTopons').isObject().withMessage('Group options must be an Object'),
  body('variants.*.groupTopons.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupTopons.type').isString().withMessage('Group option type must be a string'),
  body('variants.*.groupTopons.rules').isJSON().withMessage('Rules must be an JSON'),
  body('variants.*.groupTopons.topons').isArray().withMessage('Rules must be an Array'),
  body('variants.*.groupTopons.*.topons.*.toponId').isUUID().withMessage('ToponId must be an UUID'),
  body('variants.*.groupTopons.*.topons.*.rules').isJSON().withMessage('Rules must be an JSON')


];


const validateUpdateProductCombo = [
  body('id').notEmpty().isUUID(4).withMessage('Product ID must be a UUIDv4'),
  body('name').notEmpty().withMessage('Name must not be empty').isString().withMessage('Name must be a string'),
  body('description').isString().withMessage('Description must be a string'),
  body('type').notEmpty().withMessage('Type must not be empty').isString().withMessage('Type must be a string'),
  body('items').notEmpty().withMessage('Items must not be empty').isArray().withMessage('Items must be an array').custom((value) => {
    if (value.length === 0) {
      throw new Error('Items must not be empty');
    }
    for (let i = 0; i < value.length; i++) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value[i])) {
        throw new Error('Item id must be a valid UUID');
      }
    }
    return true;
  }),
  body('locationIds').isArray().withMessage('Location must be an array').custom((value) => {
    if (value.length === 0) {
      throw new Error('Location must not be empty');
    }
    for (let i = 0; i < value.length; i++) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value[i])) {
        throw new Error('Location id must be a valid UUID');
      }
    }
    return true;
  }),

]

const validateProductId = [
  param('productId').notEmpty().isUUID(4).withMessage('Product ID must be a UUIDv4'),

];

const validateLocationId = [
  param('locationId').notEmpty().isUUID(4).withMessage('Location ID must be a UUIDv4'),

];
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return
  }
  next();

}


module.exports = {
  validateCreateProduct,
  validateProductId,
  validateResults,
  validateUpdateProduct,
  validateLocationId,
  validateUpdateProductCombo,
  validateCreateProductCombo
};
