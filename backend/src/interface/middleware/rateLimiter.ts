import rateLimit from 'express-rate-limit';
import { AppConstants } from '@shared/constants/AppConstants';
import { ApiResponse } from '@shared/types/Common';

export const createRateLimiter = (windowMs: number, max: number, message: string) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        } as ApiResponse,
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Signup rate limiter - 5 requests per 15 minutes
export const signupRateLimiter = createRateLimiter(
    AppConstants.RATE_LIMIT_WINDOW_MS,
    AppConstants.RATE_LIMIT_MAX_REQUESTS,
    'Too many signup attempts. Please try again later.'
);

// Login rate limiter - 10 requests per 15 minutes
export const loginRateLimiter = createRateLimiter(
    AppConstants.RATE_LIMIT_WINDOW_MS,
    10,
    'Too many login attempts. Please try again later.'
);

// OTP verification rate limiter - 5 requests per 5 minutes
export const otpRateLimiter = createRateLimiter(
    5 * 60 * 1000, // 5 minutes
    5,
    'Too many OTP verification attempts. Please try again later.'
);

//rate limiter for resend OTP - 3 requests per 10 minutes
export const resendOtpRateLimiter = createRateLimiter(
    10 * 60 * 1000, // 10 minutes
    3,               // 3 requests max
    'Too many OTP resend attempts. Please try again later.'
);

// Refresh token rate limiter - 10 requests per 5 minutes
export const refreshTokenRateLimiter = createRateLimiter(
    5 * 60 * 1000, // 5 minutes
    10,            // 10 requests max
    'Too many token refresh attempts. Please try again later.'
);

// Logout rate limiter - 5 requests per minute (generous for logout)
export const logoutRateLimiter = createRateLimiter(
    60 * 1000,     // 1 minute
    5,             // 5 requests max
    'Too many logout attempts. Please try again later.'
);

// Forgot password request rate limiter - 3 requests per 15 minutes
export const forgotPasswordRequestRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    3,              // 3 requests max
    'Too many password reset requests. Please try again later.'
);

// Forgot password verify rate limiter - 5 requests per 10 minutes
export const forgotPasswordVerifyRateLimiter = createRateLimiter(
    10 * 60 * 1000, // 10 minutes
    5,              // 5 requests max
    'Too many password reset verification attempts. Please try again later.'
);
