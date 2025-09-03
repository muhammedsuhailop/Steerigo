import { body } from 'express-validator';

export const signupRequestValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),

    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

    body('mobile')
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage('Please provide a valid mobile number'),

    body('dob')
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

    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),

    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must be less than 500 characters'),

    body('role')
        .optional()
        .isIn(['Rider', 'Driver'])
        .withMessage('Role must be either Rider or Driver')
];

export const signupVerifyValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('otp')
        .isLength({ min: 4, max: 6 })
        .withMessage('OTP must be exactly 6 characters')
        .isNumeric()
        .withMessage('OTP must contain only numbers')
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters')
];

export const resendOtpValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

export const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters'),
    body('newPassword')
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
]

export const refreshTokenValidation = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isLength({ min: 64, max: 256 })
        .withMessage('Invalid refresh token format')
];

export const logoutValidation = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isLength({ min: 64, max: 256 })
        .withMessage('Invalid refresh token format')
];


export const forgotPasswordRequestValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters')
];

export const forgotPasswordVerifyValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('otp')
        .isLength({ min: 4, max: 6 })
        .withMessage('OTP must be exactly 6 characters')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),

    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('New password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

