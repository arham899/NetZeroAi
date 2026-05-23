const { body, validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Signup validation rules
const signupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email is too long'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    handleValidationErrors
];

// Login validation rules
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

// Calculation validation rules
const calculationValidation = [
    body('category')
        .optional()
        .trim()
        .isIn(['transport', 'energy', 'food', 'lifestyle', 'other']).withMessage('Invalid category'),

    body('value')
        .optional()
        .isNumeric().withMessage('Value must be a number')
        .custom((value) => value >= 0).withMessage('Value cannot be negative'),

    handleValidationErrors
];

// Forgot password validation rules
const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    handleValidationErrors
];

// Verify reset code validation rules
const verifyCodeValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('code')
        .trim()
        .notEmpty().withMessage('Verification code is required')
        .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
        .isNumeric().withMessage('Code must contain only numbers'),

    handleValidationErrors
];

// Reset password validation rules
const resetPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('code')
        .trim()
        .notEmpty().withMessage('Verification code is required')
        .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
        .isNumeric().withMessage('Code must contain only numbers'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    handleValidationErrors
];

module.exports = {
    signupValidation,
    loginValidation,
    calculationValidation,
    forgotPasswordValidation,
    verifyCodeValidation,
    resetPasswordValidation,
    handleValidationErrors
};
