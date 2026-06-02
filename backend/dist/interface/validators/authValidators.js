"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyValidation = exports.forgotPasswordRequestValidation = exports.logoutValidation = exports.refreshTokenValidation = exports.updatePasswordValidation = exports.resendOtpValidation = exports.loginValidation = exports.signupVerifyValidation = exports.signupRequestValidation = void 0;
const express_validator_1 = require("express-validator");
exports.signupRequestValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    (0, express_validator_1.body)('mobile')
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage('Please provide a valid mobile number'),
    (0, express_validator_1.body)('dob')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date')
        .custom((value) => {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 13) {
            throw new Error('Must be at least 13 years old');
        }
        if (age > 120) {
            throw new Error('Please provide a valid date of birth');
        }
        return true;
    }),
    (0, express_validator_1.body)('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    (0, express_validator_1.body)('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must be less than 500 characters'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['Rider', 'Driver'])
        .withMessage('Role must be either Rider or Driver')
];
exports.signupVerifyValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('otp')
        .isLength({ min: 4, max: 6 })
        .withMessage('OTP must be exactly 6 characters')
        .isNumeric()
        .withMessage('OTP must contain only numbers')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters')
];
exports.resendOtpValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];
exports.updatePasswordValidation = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('New password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase')
        .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
            throw new Error('New password must be different from current password');
        }
        return true;
    })
];
exports.refreshTokenValidation = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isLength({ min: 64, max: 256 })
        .withMessage('Invalid refresh token format')
];
exports.logoutValidation = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isLength({ min: 64, max: 256 })
        .withMessage('Invalid refresh token format')
];
exports.forgotPasswordRequestValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters')
];
exports.forgotPasswordVerifyValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('otp')
        .isLength({ min: 4, max: 6 })
        .withMessage('OTP must be exactly 6 characters')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('New password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];
//# sourceMappingURL=authValidators.js.map