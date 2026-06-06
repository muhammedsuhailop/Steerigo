"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHelper = void 0;
class CookieHelper {
    // Set refresh token as httpOnly cookie
    static setRefreshTokenCookie(res, refreshToken) {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Cannot be accessed by client-side JavaScript
            secure: isProduction, // HTTPS only in production
            sameSite: isProduction ? "strict" : "lax", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: "/", // Available for all routes
        });
    }
    // Clear refresh token cookie
    static clearRefreshTokenCookie(res) {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            path: "/",
        });
    }
    // Get cookie options for production/development
    static getSecureCookieOptions() {
        const isProduction = process.env.NODE_ENV === "production";
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        };
    }
}
exports.CookieHelper = CookieHelper;
//# sourceMappingURL=CookieHelper.js.map