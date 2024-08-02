const { body, validationResult } = require('express-validator');

const validateCreateOrder = [
  body('userId').notEmpty().withMessage('User ID is required').isUUID(4).withMessage('User ID must be a UUIDv4'),
  // body('locationId').notEmpty().withMessage('Location ID is required').isUUID(4).withMessage('Location ID must be a UUIDv4'),
  body('status').isString().withMessage('Status must be a string'),
  body('totalPrice').isNumeric().withMessage('Total price must be a number'),

  body('OrderItem').isArray().withMessage('Order items must be an array'),

  body('OrderItem.*.productId').notEmpty().withMessage('Product ID is required').isUUID(4).withMessage('Product ID must be a UUIDv4'),
  body('OrderItem.*.type').isIn(['single', 'combo']).withMessage('Type must be either "single" or "combo"'),
  body('OrderItem.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('OrderItem.*.variantId').if(body('OrderItem.*.type').equals('single')).notEmpty().withMessage('Variant ID is required for single products').isUUID(4).withMessage('Variant ID must be a UUIDv4'),
  body('OrderItem.*.options').if(body('OrderItem.*.type').equals('single')).isArray().withMessage('Options must be an array for single products'),
  body('OrderItem.*.options.*.optionId').if(body('OrderItem.*.type').equals('single')).isUUID(4).withMessage('Option ID must be a valid UUID'),

  body('OrderItem.*.topons').if(body('OrderItem.*.type').equals('single')).isArray().withMessage('Topon must be an array for single products'),
  // body('OrderItem.*.topons.*.toponId').if(body('OrderItem.*.type').equals('single')).isUUID(4).withMessage('Topon ID must be a valid UUID'),
  body('OrderItem.*.topons.*.quantity').if(body('OrderItem.*.type').equals('single')).isInt({ min: 1 }).withMessage('Topon quantity must be a positive integer'),

  body('OrderItem.*.comboVariants').if(body('OrderItem.*.type').equals('combo')).isArray().withMessage('Combo variants must be an array for combo products'),
  body('OrderItem.*.comboVariants.*.variantId').if(body('OrderItem.*.type').equals('combo')).notEmpty().withMessage('Variant ID is required for combo variants').isUUID(4).withMessage('Variant ID must be a UUIDv4'),
  body('OrderItem.*.comboVariants.*.options').if(body('OrderItem.*.type').equals('combo')).isArray().withMessage('Options must be an array for combo variants'),
  // body('OrderItem.*.comboVariants.*.options.*.optionId').if(body('OrderItem.*.type').equals('combo')).isUUID(4).withMessage('Option ID must be a valid UUID'),
  body('OrderItem.*.comboVariants.*.topons').if(body('OrderItem.*.type').equals('combo')).isArray().withMessage('Topon must be an array for combo variants'),
  body('OrderItem.*.comboVariants.*.topons.*.toponId').if(body('OrderItem.*.type').equals('combo')).isUUID(4).withMessage('Topon ID must be a valid UUID'),
  body('OrderItem.*.comboVariants.*.topons.*.quantity').if(body('OrderItem.*.type').equals('combo')).isInt({ min: 1 }).withMessage('Topon quantity must be a positive integer'),
];

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateOrder,
  validateResults
};
