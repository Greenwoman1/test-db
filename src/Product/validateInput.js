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
    body('*.variants.*.topons.*.quantity').optional().isNumeric().withMessage('Topon quantity must be a number'),
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
/* 

const validateUpdateProduct = [
    param('id').isString().withMessage('Product ID must be a string'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('type').optional().isString().withMessage('Type must be a string'),
    body('variants').optional().isArray().withMessage('Variants must be an array'),
    body('variants.*.name').optional().isString().withMessage('Variant name must be a string'),
    body('variants.*.topons').optional().isArray().withMessage('Topons must be an array'),
    body('variants.*.topons.*.name').optional().isString().withMessage('Topon name must be a string'),
    body('variants.*.topons.*.quantity').optional().isNumeric().withMessage('Topon quantity must be a number'),
    body('variants.*.groupOptions').optional().isArray().withMessage('Group options must be an array'),
    body('variants.*.groupOptions.*.name').optional().isString().withMessage('Group option name must be a string'),
    body('variants.*.groupOptions.*.type').optional().isString().withMessage('Group option type must be a string'),
    body('variants.*.groupOptions.*.rules').optional().isString().withMessage('Group option rule must be a string'),
    body('variants.*.groupOptions.*.options').optional().isArray().withMessage('Options must be an array'),
    body('variants.*.groupOptions.*.options.*.name').optional().isString().withMessage('Option name must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]; */
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
]; */


const validateProductId = [
    param('id').notEmpty().isUUID(4).withMessage('Product ID must be a UUIDv4'),
   
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
    validateResults
};
