import { Router } from 'express';
import { signupRequest, signupVerify, login } from '../controllers/authController.ts';
import { signupRequestValidation, signupVerifyValidation, loginValidation } from '../../utils/validators.ts';
import { signupLimiter } from '../middleware/rateLimiter.ts';

const router = Router();
router.post('/signup', signupLimiter, signupRequestValidation, signupRequest);
router.post('/signup-verify', signupVerifyValidation, signupVerify);
router.post('/login', loginValidation, login);

export default router;
