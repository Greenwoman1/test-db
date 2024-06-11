const { body, param, validationResult } = require('express-validator');

const validateCreateUser = [
    body('firstName').isString().withMessage('First name must be a string'),
    body('lastName').isEmail().withMessage('Last name must be a string'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(errors);
        next();
    }
];

const validateUpdateUser = [
    param('id').isUUID().withMessage('User ID must be a valid UUID'),
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isEmail().withMessage('Last name must be a string'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateDeleteUser = [
    param('id').isUUID().withMessage('User ID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateGetUserById = [
    param('id').isUUID().withMessage('User ID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateDeleteUser,
    validateGetUserById,
};


/* 
const validateUpdateUser = (req, res, next) => {
    const { firstName, lastName, password } = req.body;
    const { id } = req.params;
    const errors = [];

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
        errors.push({ msg: 'User ID must be a valid UUID' });
    }

    if (firstName !== undefined) {
        if (typeof firstName !== 'string' || firstName.length < 1 || firstName.length > 50) {
            errors.push({ msg: 'First name must be a string between 1 and 50 characters long' });
        }
    }

    if (lastName !== undefined) {
        if (typeof lastName !== 'string' || lastName.length < 1 || lastName.length > 50) {
            errors.push({ msg: 'Last name must be a string between 1 and 50 characters long' });
        }
    }

    if (password !== undefined) {
        if (typeof password !== 'string' || password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters long' });
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
}; */