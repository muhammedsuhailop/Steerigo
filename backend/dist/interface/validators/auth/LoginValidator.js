"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginValidationMiddleware = exports.validateRefreshTokenRequest = exports.validateLoginRequest = void 0;
const zod_1 = require("zod");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
// Login validation schema
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .nonempty(AuthConstants_1.AuthValidationMessages.EMAIL_REQUIRED)
            .email(AuthConstants_1.AuthValidationMessages.EMAIL_INVALID)
            .max(255, AuthConstants_1.AuthValidationMessages.EMAIL_TOO_LONG)
            .transform((email) => email.toLowerCase().trim()),
        password: zod_1.z
            .string()
            .nonempty(AuthConstants_1.AuthValidationMessages.PASSWORD_REQUIRED)
            .max(128, AuthConstants_1.AuthValidationMessages.PASSWORD_TOO_LONG),
    }),
});
// Refresh token validation schema
const refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string()
            .nonempty(AuthConstants_1.AuthValidationMessages.REFRESH_TOKEN_REQUIRED)
            .min(64, AuthConstants_1.AuthValidationMessages.REFRESH_TOKEN_INVALID)
            .max(256, AuthConstants_1.AuthValidationMessages.REFRESH_TOKEN_INVALID),
    }),
});
const validateLoginRequest = (req, res, next) => {
    try {
        const validatedData = loginSchema.parse({
            body: req.body,
        });
        // Replace request body with validated and transformed data
        req.body = validatedData.body;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Login validation failed", {
            email: req.body?.email,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: messages,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateLoginRequest = validateLoginRequest;
const validateRefreshTokenRequest = (req, res, next) => {
    try {
        const validatedData = refreshTokenSchema.parse({
            body: req.body,
        });
        req.body = validatedData.body;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Refresh token validation failed", { error });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: messages,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateRefreshTokenRequest = validateRefreshTokenRequest;
// Enhanced middleware with rate limiting integration
const createLoginValidationMiddleware = (options) => {
    return [
        ...(options?.enableRateLimit
            ? [
            /* add rate limiter here */
            ]
            : []),
        exports.validateLoginRequest,
    ];
};
exports.createLoginValidationMiddleware = createLoginValidationMiddleware;
//# sourceMappingURL=LoginValidator.js.map