import { Router, Request, Response } from 'express';
import { container } from '@infrastructure/container/Container';
import { AuthController } from '../controllers/AuthController';
import {
    signupRequestValidation,
    signupVerifyValidation,
    loginValidation,
    resendOtpValidation,
    updatePasswordValidation
} from '../validators/authValidators';
import {
    signupRateLimiter,
    loginRateLimiter,
    otpRateLimiter,
    resendOtpRateLimiter,
} from '../middleware/RateLimiter';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const authController = container.get<AuthController>(AuthController);

// POST /api/auth/signup - Signup request with OTP
router.post('/signup',
    signupRateLimiter,
    signupRequestValidation,
    (req: Request, res: Response) => authController.signupRequest(req, res)
);

// POST /api/auth/signup/verify - Verify signup OTP
router.post('/signup/verify',
    otpRateLimiter,
    signupVerifyValidation,
    (req: Request, res: Response) => authController.signupVerify(req, res)
);

// POST /api/auth/login - User login
router.post('/login',
    loginRateLimiter,
    loginValidation,
    (req: Request, res: Response) => authController.login(req, res)
);

// POST /api/auth/resend-otp - Resend OTP for signup
router.post('/resend-otp',
    resendOtpRateLimiter,
    resendOtpValidation,
    (req: Request, res: Response) => authController.resendOtp(req, res)
);

// PUT /api/auth/update-password - Update password for logged-in users
router.put('/update-password',
    AuthMiddleware.authenticate,  
    updatePasswordValidation,
    (req: Request, res: Response) => authController.updatePassword(req, res)
);


export { router as authRoutes };
