import { Router } from "express";
import { container } from "@infrastructure/container/Container";
import { SignupController } from "../controllers/auth/SignupController";
import { LoginController } from "../controllers/auth/LoginController";
import { OtpController } from "../controllers/auth/OtpController";
import { PasswordController } from "../controllers/auth/PasswordController";
import { SocialAuthController } from "../controllers/auth/SocialAuthController";
import { UserController } from "../controllers/auth/UserController";

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

// Resolve controllers
const signupCtrl = container.resolve(SignupController);
const loginCtrl = container.resolve(LoginController);
const otpCtrl = container.resolve(OtpController);
const pwdCtrl = container.resolve(PasswordController);
const socialCtrl = container.resolve(SocialAuthController);
const userCtrl = container.resolve(UserController);

// Signup
router.post(
  "/signup",
  signupRateLimiter,
  signupRequestValidation,
  signupCtrl.request.bind(signupCtrl)
);
router.post(
  "/signup/verify",
  otpRateLimiter,
  signupVerifyValidation,
  signupCtrl.verify.bind(signupCtrl)
);

// Login & Session
router.post(
  "/login",
  loginRateLimiter,
  loginValidation,
  loginCtrl.login.bind(loginCtrl)
);
router.post(
  "/logout",
  logoutRateLimiter,
  logoutValidation,
  loginCtrl.logout.bind(loginCtrl)
);
router.post(
  "/refresh",
  refreshTokenRateLimiter,
  refreshTokenValidation,
  loginCtrl.refreshToken.bind(loginCtrl)
);

// OTP Flows
router.post(
  "/resend-otp",
  resendOtpRateLimiter,
  resendOtpValidation,
  otpCtrl.resendOtp.bind(otpCtrl)
);
router.post(
  "/forgot-password",
  forgotPasswordRequestRateLimiter,
  forgotPasswordRequestValidation,
  otpCtrl.forgotPasswordRequest.bind(otpCtrl)
);
router.post(
  "/forgot-password/verify",
  forgotPasswordVerifyRateLimiter,
  forgotPasswordVerifyValidation,
  otpCtrl.forgotPasswordVerify.bind(otpCtrl)
);

// Password
router.put(
  "/update-password",
  authMiddleware,
  updatePasswordValidation,
  pwdCtrl.updatePassword.bind(pwdCtrl)
);

// Social Auth
router.get("/google", socialCtrl.getGoogleAuthUrl.bind(socialCtrl));
router.get("/google/callback", socialCtrl.googleCallback.bind(socialCtrl));

// Current User
router.get("/me", authMiddleware, userCtrl.getCurrentUser.bind(userCtrl));

export { router as authRoutes };
