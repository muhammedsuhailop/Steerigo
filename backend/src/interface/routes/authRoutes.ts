import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/Container";
import { AuthController } from "../controllers/AuthController";
import {
  signupRequestValidation,
  signupVerifyValidation,
  loginValidation,
  resendOtpValidation,
  updatePasswordValidation,
  refreshTokenValidation,
  logoutValidation,
  forgotPasswordRequestValidation,
  forgotPasswordVerifyValidation,
} from "../validators/authValidators";
import {
  signupRateLimiter,
  loginRateLimiter,
  otpRateLimiter,
  resendOtpRateLimiter,
  refreshTokenRateLimiter,
  logoutRateLimiter,
  forgotPasswordRequestRateLimiter,
  forgotPasswordVerifyRateLimiter,
} from "../middleware/security/RateLimiter";
import { authMiddleware } from "../middleware/auth/AuthMiddleware";

const router = Router();
const authController = container.get<AuthController>(AuthController);

// POST /api/auth/signup - Signup request with OTP
router.post(
  "/signup",
  signupRateLimiter,
  signupRequestValidation,
  (req: Request, res: Response) => authController.signupRequest(req, res)
);

// POST /api/auth/signup/verify - Verify signup OTP
router.post(
  "/signup/verify",
  otpRateLimiter,
  signupVerifyValidation,
  (req: Request, res: Response) => authController.signupVerify(req, res)
);

// POST /api/auth/login - User login
router.post(
  "/login",
  loginRateLimiter,
  loginValidation,
  (req: Request, res: Response) => authController.login(req, res)
);

// POST /api/auth/resend-otp - Resend OTP for signup
router.post(
  "/resend-otp",
  resendOtpRateLimiter,
  resendOtpValidation,
  (req: Request, res: Response) => authController.resendOtp(req, res)
);

// PUT /api/auth/update-password - Update password for logged-in users
router.put(
  "/update-password",
  authMiddleware,
  updatePasswordValidation,
  (req: Request, res: Response) => authController.updatePassword(req, res)
);

// POST /api/auth/refresh - Refresh access token using refresh token
router.post(
  "/refresh",
  refreshTokenRateLimiter,
  refreshTokenValidation,
  (req: Request, res: Response) => authController.refreshToken(req, res)
);

// POST /api/auth/logout - Logout and revoke refresh token
router.post(
  "/logout",
  logoutRateLimiter,
  logoutValidation,
  (req: Request, res: Response) => authController.logout(req, res)
);

// POST /api/auth/forgot-password - Request password reset OTP
router.post(
  "/forgot-password",
  forgotPasswordRequestRateLimiter,
  forgotPasswordRequestValidation,
  (req: Request, res: Response) =>
    authController.forgotPasswordRequest(req, res)
);

// POST /api/auth/reset-password - Verify OTP and reset password
router.post(
  "/reset-password",
  forgotPasswordVerifyRateLimiter,
  forgotPasswordVerifyValidation,
  (req: Request, res: Response) => authController.forgotPasswordVerify(req, res)
);

// GET /api/auth/google - Get Google OAuth URL
router.get("/google", (req, res) => authController.getGoogleAuthUrl(req, res));

// GET /api/auth/google/callback - Handle Google OAuth callback
router.get("/google/callback", (req, res) =>
  authController.googleCallback(req, res)
);

// GET /api/auth/me - Get current user data
router.get("/me", authMiddleware, (req: Request, res: Response) =>
  authController.getCurrentUser(req, res)
);

export { router as authRoutes };
