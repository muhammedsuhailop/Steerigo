import { body } from 'express-validator';

export const signupRequestValidation = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('mobile').optional().isMobilePhone('any'),
  body('dob').optional().isISO8601(),
  body('role').optional().isIn(['Rider','Driver','Admin'])
];

export const signupVerifyValidation = [
  body('email').isEmail(),
  body('otp').isLength({ min: 4, max: 10 })
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').isString().notEmpty()
];