export declare const createRateLimiter: (windowMs: number, max: number, message: string) => import("express-rate-limit").RateLimitRequestHandler;
export declare const signupRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const loginRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const otpRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const resendOtpRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const refreshTokenRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const logoutRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const forgotPasswordRequestRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const forgotPasswordVerifyRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=RateLimiter.d.ts.map