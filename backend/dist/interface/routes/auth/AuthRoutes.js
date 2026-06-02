"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const AuthMiddleware_1 = require("@interface/middleware/auth/AuthMiddleware");
const authValidationSchemas_1 = require("@interface/validators/auth/authValidationSchemas");
const DITypes_1 = require("@shared/constants/DITypes");
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Get controller instances from DI container
const loginController = DIContainer_1.container.get(DITypes_1.TYPES.LoginController);
const signupController = DIContainer_1.container.get(DITypes_1.TYPES.SignupController);
const passwordController = DIContainer_1.container.get(DITypes_1.TYPES.PasswordController);
const otpController = DIContainer_1.container.get(DITypes_1.TYPES.OtpController);
const socialAuthController = DIContainer_1.container.get(DITypes_1.TYPES.SocialAuthController);
const userController = DIContainer_1.container.get(DITypes_1.TYPES.UserAuthController);
// Auth routes
router.post("/login", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.loginSchema), loginController.login.bind(loginController));
router.post("/logout", loginController.logout.bind(loginController));
router.post("/refresh-token", loginController.refreshToken.bind(loginController));
// Signup routes
router.post("/signup", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.signupRequestSchema), signupController.signup.bind(signupController));
router.post("/signup/verify", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.signupVerifySchema), signupController.verify.bind(signupController));
// Password routes
router.post("/forgot-password", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.forgotPasswordRequestSchema), passwordController.forgotPasswordRequest.bind(passwordController));
router.post("/reset-password", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.forgotPasswordVerifySchema), passwordController.forgotPasswordVerify.bind(passwordController));
router.put("/update-password", AuthMiddleware_1.authMiddleware, (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.updatePasswordSchema), passwordController.updatePassword.bind(passwordController));
// OTP routes
router.post("/resend-otp", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.resendOtpSchema), otpController.resendOtp.bind(otpController));
// Social auth routes
router.get("/google", socialAuthController.getGoogleAuthUrl.bind(socialAuthController));
router.get("/google/callback", (0, ValidationMiddleware_1.validateSchema)(authValidationSchemas_1.googleLoginSchema), socialAuthController.googleLogin.bind(socialAuthController));
// User routes
router.get("/me", AuthMiddleware_1.authMiddleware, userController.getCurrentUser.bind(userController));
//# sourceMappingURL=AuthRoutes.js.map