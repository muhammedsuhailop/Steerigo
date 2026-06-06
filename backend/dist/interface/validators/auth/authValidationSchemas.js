"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.googleLoginSchema = exports.resendOtpSchema = exports.updatePasswordSchema = exports.forgotPasswordVerifySchema = exports.forgotPasswordRequestSchema = exports.loginSchema = exports.signupVerifySchema = exports.signupRequestSchema = void 0;
const zod_1 = require("zod");
exports.signupRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be less than 100 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
        email: zod_1.z
            .string()
            .email("Invalid email address")
            .max(255, "Email must be less than 255 characters"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be less than 128 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
        mobile: zod_1.z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    }),
});
exports.signupVerifySchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        otp: zod_1.z
            .string()
            .length(4, "OTP must be 4 digits")
            .regex(/^\d+$/, "OTP must contain only numbers"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.forgotPasswordRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
    }),
});
exports.forgotPasswordVerifySchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        otp: zod_1.z
            .string()
            .length(4, "OTP must be 4 digits")
            .regex(/^\d+$/, "OTP must contain only numbers"),
        newPassword: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be less than 128 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    }),
});
exports.updatePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, "Current password is required"),
        newPassword: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be less than 128 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    }),
});
exports.resendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
    }),
});
exports.googleLoginSchema = zod_1.z.object({
    query: zod_1.z.object({
        code: zod_1.z.string().min(1, "Authorization code is required"),
        access_token: zod_1.z.string().optional(),
        id_token: zod_1.z.string().optional(),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, "Refresh token is required"),
    }),
});
//# sourceMappingURL=authValidationSchemas.js.map