const { body, param, validationResult } = require('express-validator');

const validateOrder = [
  body('userId')
    .isUUID().withMessage('Invalid userId format')
    .isLength({ min: 4, max: 64 }).withMessage('userId must be between 4 and 64 characters'),
  body('locationId')
    .isUUID().withMessage('Invalid locationId format')
    .isLength({ min: 4, max: 64 }).withMessage('locationId must be between 4 and 64 characters'),
  body('force')
    .isBoolean().withMessage('Force must be a boolean value'),
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId')
    .isUUID().withMessage('Invalid productId format')
    .notEmpty().withMessage('productId cannot be empty')
    .isLength({ min: 4, max: 64 }).withMessage('productId must be between 4 and 64 characters'),
  body('items.*.vlId')
    .isUUID().withMessage('Invalid vlId format')
    .notEmpty().withMessage('vlId cannot be empty')
    .isLength({ min: 4, max: 64 }).withMessage('vlId must be between 4 and 64 characters'),
  body('items.*.type')
    .isIn(['single', 'combo']).withMessage('Type must be either "single" or "combo"')
    .notEmpty().withMessage('type cannot be empty')
    .isLength({ min: 4, max: 64 }).withMessage('type must be between 4 and 64 characters'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
  body('items.*.options')
    .isArray().withMessage('Options must be an array'),
  body('items.*.options.*')
    .isUUID().withMessage('Invalid optionId format')
    .optional({ nullable: true }).isLength({ min: 4, max: 64 }).withMessage('optionId must be between 4 and 64 characters'),
  body('items.*.topons')
    .isArray().withMessage('Topons must be an array'),
  body('items.*.topons.*.toponId')
    .isUUID().withMessage('Invalid toponId format')
    .optional({ nullable: true }).isLength({ min: 4, max: 64 }).withMessage('toponId must be between 4 and 64 characters'),
  body('items.*.topons.*.quantity')
    .isInt({ min: 1 }).withMessage('Topon quantity must be an integer greater than 0')

];

const validateOrderId = [
  param('orderId')
    .isUUID().withMessage('Invalid orderId format')
    .isLength({ min: 4, max: 64 }).withMessage('orderId must be between 4 and 64 characters'),
];


const validateLocationId = [
  param('locationId')
    .isUUID().withMessage('Invalid locationId format')
    .isLength({ min: 4, max: 64 }).withMessage('locationId must be between 4 and 64 characters'),

];


const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}




module.exports = {validateOrder, validateResult, validateOrderId, validateLocationId};
