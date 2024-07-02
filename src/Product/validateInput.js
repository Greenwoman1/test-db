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
  body('variants.*.groupTopons').isObject().withMessage('Group options must be an Object'),
  body('variants.*.groupTopons.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupTopons.type').isString().withMessage('Group option type must be a string'),
  body('variants.*.groupTopons.rules').isJSON().withMessage('Rules must be an JSON'),
  body('variants.*.groupTopons.topons').isArray().withMessage('Rules must be an Array'),
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
  body('name').isString().withMessage('Name must be a string'),
  body('description').isString().withMessage('Description must be a string'),
  body('type').isString().withMessage('Type must be a string'),
  body('variants').isArray().withMessage('Variants must be an array'),
  body('variants.*.name').isString().withMessage('Variant name must be a string'),
  body('variants.*.topons').isArray().withMessage('Topons must be an array'),
  body('variants.*.topons.*.toponId').optional().isUUID().withMessage('Topon id must be a string'),
  body('variants.*.locationIds').isArray().withMessage('Variant location ids must be an array').custom((value) => {
    if (value.length === 0) {
      throw new Error('Location ids must not be empty');
    }
    for (let i = 0; i < value.length; i++) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value[i])) {
        throw new Error('Location id must be a valid UUID');
      }
    }

    return true;
  }),
  body('variants.*.groupOptions').isArray().withMessage('Group options must be an array'),
  body('variants.*.groupOptions.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupOptions.*.type').isString().withMessage('Group option type must be a string'),
  body('variants.*.groupOptions.*.rules').optional().isArray().withMessage('Rules must be an array').custom((value, { req, path }) => {
    if (value && value.length > 0) {
      value.forEach((rule, index) => {
        if (!rule.name) {
          throw new Error(`Rule name is required at ${path}[${index}].name`);
        }
        if (!rule.description) {
          throw new Error(`Rule description is required at ${path}[${index}].description`);
        }
        if (!rule.ruleType) {
          throw new Error(`Rule type is required at ${path}[${index}].ruleType`);
        }
        if (!rule.ruleValue) {
          throw new Error(`Rule value is required at ${path}[${index}].ruleValue`);
        }
      });
    }
    return true;
  }),
  body('variants.*.groupOptions.*.options').optional().isArray().withMessage('Options must be an array').custom((value, { req, path }) => {
    if (value && value.length > 0) {
      value.forEach((option, index) => {
        if (!option.name) {
          throw new Error(`Option name is required at ${path}[${index}].name`);
        }
      });
    }
    return true;
  })
];


const validateUpdateProductCombo = [
  body('id').notEmpty().isUUID(4).withMessage('Product ID must be a UUIDv4'),
  body('name').isString().withMessage('Name must be a string'),
  body('description').isString().withMessage('Description must be a string'),
  body('type').isString().withMessage('Type must be a string'),
  body('items').isArray().withMessage('Items must be an array').custom((value) => {
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
