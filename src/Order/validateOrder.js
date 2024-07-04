const { body, param, validationResult } = require('express-validator');


const validateCreateOrder = [

  body('userId').notEmpty().withMessage('User ID is required').isUUID(4).withMessage('User ID must be a UUIDv4'),
  body('locationId').notEmpty().withMessage('Location ID is required').isUUID(4).withMessage('Location ID must be a UUIDv4'),
  body('status')./* isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status') */isString().withMessage('Status must be a string'),

  body('products.*.productId').notEmpty().withMessage('Product ID is required').isUUID(4).withMessage('Product ID must be a UUIDv4'),
  body('products.*.variantId').notEmpty().withMessage('Variant ID is required').isUUID(4).withMessage('Variant ID must be a UUIDv4'),

  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('products.*.topons').isArray({ min: 1 }).withMessage('At least one topon must be selected for each product'),
  body('products.*.topons.*').isUUID().withMessage('Topon ID must be a valid UUID'),

  body('products.*.options').isArray({ min: 1 }).withMessage('At least one option must be selected for each product'),
  body('products.*.options.*').isUUID().withMessage('Option ID must be a valid UUID'),

  // Validate status for each product
  body('products.*.status')./* isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status for product') */isString().withMessage('Status must be a string'),


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
  validateCreateOrder,
  validateResults
};
