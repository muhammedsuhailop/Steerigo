"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyRateLimiter = exports.forgotPasswordRequestRateLimiter = exports.logoutRateLimiter = exports.refreshTokenRateLimiter = exports.resendOtpRateLimiter = exports.otpRateLimiter = exports.loginRateLimiter = exports.signupRateLimiter = exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AppConstants_1 = require("@shared/constants/AppConstants");
const createRateLimiter = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: {
            success: false,
            message,
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimiter = createRateLimiter;
// Signup rate limiter - 5 requests per 15 minutes
exports.signupRateLimiter = (0, exports.createRateLimiter)(AppConstants_1.AppConstants.RATE_LIMIT_WINDOW_MS, AppConstants_1.AppConstants.RATE_LIMIT_MAX_REQUESTS, "Too many signup attempts. Please try again later.");
// Login rate limiter - 10 requests per 15 minutes
exports.loginRateLimiter = (0, exports.createRateLimiter)(AppConstants_1.AppConstants.RATE_LIMIT_WINDOW_MS, 100, //for dev
"Too many login attempts. Please try again later.");
// OTP verification rate limiter - 5 requests per 5 minutes
exports.otpRateLimiter = (0, exports.createRateLimiter)(5 * 60 * 1000, // 5 minutes
50, //for dev
"Too many OTP verification attempts. Please try again later.");
//rate limiter for resend OTP - 3 requests per 10 minutes
exports.resendOtpRateLimiter = (0, exports.createRateLimiter)(10 * 60 * 1000, // 10 minutes
30, //for dev      // 3 requests max
"Too many OTP resend attempts. Please try again later.");
// Refresh token rate limiter - 10 requests per 5 minutes
exports.refreshTokenRateLimiter = (0, exports.createRateLimiter)(5 * 60 * 1000, // 5 minutes
100, // 10 requests max
"Too many token refresh attempts. Please try again later.");
// Logout rate limiter - 5 requests per minute (generous for logout)
exports.logoutRateLimiter = (0, exports.createRateLimiter)(60 * 1000, // 1 minute
50, // 5 requests max
"Too many logout attempts. Please try again later.");
// Forgot password request rate limiter - 3 requests per 15 minutes
exports.forgotPasswordRequestRateLimiter = (0, exports.createRateLimiter)(15 * 60 * 1000, // 15 minutes
30, // 3 requests max
"Too many password reset requests. Please try again later.");
// Forgot password verify rate limiter - 5 requests per 10 minutes
exports.forgotPasswordVerifyRateLimiter = (0, exports.createRateLimiter)(10 * 60 * 1000, // 10 minutes
50, // 5 requests max
"Too many password reset verification attempts. Please try again later.");
//# sourceMappingURL=RateLimiter.js.map