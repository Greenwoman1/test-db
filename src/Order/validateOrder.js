const { body, validationResult } = require('express-validator');

const validateCreateOrder = [
  body('userId').notEmpty().withMessage('User ID is required').isUUID(4).withMessage('User ID must be a UUIDv4'),
  // body('locationId').notEmpty().withMessage('Location ID is required').isUUID(4).withMessage('Location ID must be a UUIDv4'),
  body('status').isString().withMessage('Status must be a string'),
  body('totalPrice').isNumeric().withMessage('Total price must be a number'),

  body('orderItems').isArray().withMessage('Order items must be an array'),

  body('orderItems.*.productId').notEmpty().withMessage('Product ID is required').isUUID(4).withMessage('Product ID must be a UUIDv4'),
  body('orderItems.*.type').isIn(['single', 'combo']).withMessage('Type must be either "single" or "combo"'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('orderItems.*.variantId').if(body('orderItems.*.type').equals('single')).notEmpty().withMessage('Variant ID is required for single products').isUUID(4).withMessage('Variant ID must be a UUIDv4'),
  body('orderItems.*.options').if(body('orderItems.*.type').equals('single')).isArray().withMessage('Options must be an array for single products'),
  body('orderItems.*.options.*.optionId').if(body('orderItems.*.type').equals('single')).isUUID(4).withMessage('Option ID must be a valid UUID'),

  body('orderItems.*.topons').if(body('orderItems.*.type').equals('single')).isArray().withMessage('Topons must be an array for single products'),
  // body('orderItems.*.topons.*.toponId').if(body('orderItems.*.type').equals('single')).isUUID(4).withMessage('Topon ID must be a valid UUID'),
  body('orderItems.*.topons.*.quantity').if(body('orderItems.*.type').equals('single')).isInt({ min: 1 }).withMessage('Topon quantity must be a positive integer'),

  body('orderItems.*.comboVariants').if(body('orderItems.*.type').equals('combo')).isArray().withMessage('Combo variants must be an array for combo products'),
  body('orderItems.*.comboVariants.*.variantId').if(body('orderItems.*.type').equals('combo')).notEmpty().withMessage('Variant ID is required for combo variants').isUUID(4).withMessage('Variant ID must be a UUIDv4'),
  body('orderItems.*.comboVariants.*.options').if(body('orderItems.*.type').equals('combo')).isArray().withMessage('Options must be an array for combo variants'),
  // body('orderItems.*.comboVariants.*.options.*.optionId').if(body('orderItems.*.type').equals('combo')).isUUID(4).withMessage('Option ID must be a valid UUID'),
  body('orderItems.*.comboVariants.*.topons').if(body('orderItems.*.type').equals('combo')).isArray().withMessage('Topons must be an array for combo variants'),
  body('orderItems.*.comboVariants.*.topons.*.toponId').if(body('orderItems.*.type').equals('combo')).isUUID(4).withMessage('Topon ID must be a valid UUID'),
  body('orderItems.*.comboVariants.*.topons.*.quantity').if(body('orderItems.*.type').equals('combo')).isInt({ min: 1 }).withMessage('Topon quantity must be a positive integer'),
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
