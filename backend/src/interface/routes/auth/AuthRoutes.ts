import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { validateSchema } from "@interface/middleware/validationMiddleware";
import { authMiddleware } from "@interface/middleware/auth/authMiddleware";
import {
  signupRequestSchema,
  signupVerifySchema,
  loginSchema,
  forgotPasswordRequestSchema,
  forgotPasswordVerifySchema,
  updatePasswordSchema,
  resendOtpSchema,
  googleLoginSchema,
  refreshTokenSchema,
} from "@interface/validators/auth/authValidationSchemas";
import { LoginController } from "@interface/controllers/auth/LoginController";
import { SignupController } from "@interface/controllers/auth/SignupController";
import { PasswordController } from "@interface/controllers/auth/PasswordController";
import { OtpController } from "@interface/controllers/auth/OtpController";
import { SocialAuthController } from "@interface/controllers/auth/SocialAuthController";
import { UserController } from "@interface/controllers/auth/UserController";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();

// Get controller instances from DI container
const loginController = container.get<LoginController>(TYPES.LoginController);
const signupController = container.get<SignupController>(
  TYPES.SignupController
);
const passwordController = container.get<PasswordController>(
  TYPES.PasswordController
);
const otpController = container.get<OtpController>(TYPES.OtpController);
const socialAuthController = container.get<SocialAuthController>(
  TYPES.SocialAuthController
);
const userController = container.get<UserController>(TYPES.UserController);

// Auth routes
router.post(
  "/login",
  validateSchema(loginSchema),
  loginController.login.bind(loginController)
);
router.post(
  "/logout",
  validateSchema(refreshTokenSchema),
  loginController.logout.bind(loginController)
);
router.post(
  "/refresh-token",
  validateSchema(refreshTokenSchema),
  loginController.refreshToken.bind(loginController)
);

// Signup routes
router.post(
  "/signup",
  validateSchema(signupRequestSchema),
  signupController.signup.bind(signupController)
);
router.post(
  "/signup/verify",
  validateSchema(signupVerifySchema),
  signupController.verify.bind(signupController)
);

// Password routes
router.post(
  "/forgot-password",
  validateSchema(forgotPasswordRequestSchema),
  passwordController.forgotPasswordRequest.bind(passwordController)
);
router.post(
  "/reset-password",
  validateSchema(forgotPasswordVerifySchema),
  passwordController.forgotPasswordVerify.bind(passwordController)
);
router.put(
  "/update-password",
  authMiddleware,
  validateSchema(updatePasswordSchema),
  passwordController.updatePassword.bind(passwordController)
);

// OTP routes
router.post(
  "/resend-otp",
  validateSchema(resendOtpSchema),
  otpController.resendOtp.bind(otpController)
);

// Social auth routes
router.get(
  "/google",
  socialAuthController.getGoogleAuthUrl.bind(socialAuthController)
);

router.get(
  "/google/callback",
  validateSchema(googleLoginSchema),
  socialAuthController.googleLogin.bind(socialAuthController)
);

// User routes
router.get(
  "/me",
  authMiddleware,
  userController.getCurrentUser.bind(userController)
);

export { router as authRoutes };
