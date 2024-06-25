const { body, param, validationResult } = require('express-validator');
const validateCreateProduct = [
  body().isArray().withMessage('Body must be an array of products'),
  body('*.name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name must not be empty'),
  body('*.description').optional().isString().withMessage('Description must be a string'),
  body('*.type').optional().isString().withMessage('Type must be a string').isLength({ max: 16 }).withMessage('Type must be at most 16 characters long'),
  body('*.variants').optional().isArray().withMessage('Variants must be an array'),
  body('*.variants.*.name').isString().withMessage('Variant name must be a string').notEmpty().withMessage('Variant name must not be empty').isLength({ min: 4 }).withMessage('Variant name must be at least 3 characters long').isLength({ max: 64 }).withMessage('Variant name must be at most 20 characters long'),
  body('*.variants.*.description').optional().isString().withMessage('Variant description must be a string'),
  body('*.variants.*.topons').optional().isArray().withMessage('Topons must be an array'),
  body('*.items').optional().isArray().withMessage('Items must be an array'),
  body('*.variants.*.topons.*.toponId').notEmpty().withMessage('Topon id must not be empty').isUUID().withMessage('Topon id must be a valid UUID'),
  body('*.variants.*.groupOptions').optional().isArray().withMessage('Group options must be an array'),
  body('*.variants.*.groupOptions.*.name').optional().isString().withMessage('Group option name must be a string'),
  body('*.variants.*.groupOptions.*.type').optional().isString().withMessage('Group option type must be a string'),
  body('*.variants.*.groupOptions.*.options').optional().isArray().withMessage('Options must be an array'),
  body('*.variants.*.groupOptions.*.options.*.name').optional().isString().withMessage('Option name must be a string'),
  body('*.variants.*.groupOptions.*.rules').optional().isArray().withMessage('Rules must be an array'),
  body('*.variants.*.groupOptions.*.rules.*.name').optional().isString().withMessage('Rule name must be a string'),
  body('*.variants.*.groupOptions.*.rules.*.description').optional().isString().withMessage('Rule description must be a string'),
  body('*.variants.*.groupOptions.*.rules.*.ruleType').optional().isString().withMessage('Rule type must be a string'),
  body('*.variants.*.groupOptions.*.rules.*.ruleValue').optional().isString().withMessage('Rule value must be a string'),
  body('*.variants.*.groupOptions.*.options').optional().isArray().withMessage('Options must be an array'),
  body('*.variants.*.groupOptions.*.options.*.name').optional().isString().withMessage('Option name must be a string'),


];


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
  body('variants.*.groupOptions.*.name').isString().withMessage('Group option name must be a string'),
  body('variants.*.groupOptions.*.type').optional().isString().withMessage('Group option type must be a string'),
  body('variants.*.groupOptions.*.options').optional().isArray().withMessage('Options must be an array'),
  body('variants.*.groupOptions.*.options.*.name').optional().isString().withMessage('Option name must be a string'),
  body('variants.*.groupOptions.*.rules').isArray().withMessage('Rules must be an array'),
  body('variants.*.groupOptions.*.rules.*.name').isEmpty().withMessage('Rule name must not be empty').isString().withMessage('Rule name must be a string'),
  body('variants.*.groupOptions.*.rules.*.description').isEmpty().withMessage('Rule description must not be empty').isString().withMessage('Rule description must be a string'),
  body('variants.*.groupOptions.*.rules.*.ruleType').isEmpty().withMessage('Rule type must not be empty').isString().withMessage('Rule type must be a string'),
  body('variants.*.groupOptions.*.rules.*.ruleValue').isEmpty().withMessage('Rule value must not be empty').isString().withMessage('Rule value must be a string'),

];
/* 
const validateDeleteProduct = [
    param('id').isUUID().withMessage('Product ID must be a UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



*/

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
  param('locationId').notEmpty().isUUID().withMessage('Location ID must be a UUIDv4'),

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
  validateUpdateProductCombo
};
