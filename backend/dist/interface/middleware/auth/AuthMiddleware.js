"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const Logger_1 = require("@shared/utils/Logger");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const response = {
                success: false,
                message: AuthConstants_1.AuthMessages.ACCESS_TOKEN_REQUIRED,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json(response);
            return;
        }
        const token = authHeader.substring(7);
        const tokenService = DIContainer_1.container.get(DITypes_1.TYPES.TokenService);
        const payload = tokenService.verifyAccessToken(token);
        if (!payload) {
            const response = {
                success: false,
                message: AuthConstants_1.AuthMessages.TOKEN_INVALID,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json(response);
            return;
        }
        // Verify user still exists and is active
        const userRepository = DIContainer_1.container.get(DITypes_1.TYPES.UserRepository);
        const user = await userRepository.findById(payload.userId);
        if (!user || !user.canLogin()) {
            const response = {
                success: false,
                message: AuthConstants_1.AuthMessages.AUTHENTICATION_FAILED,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json(response);
            return;
        }
        // Attach user info to request
        req.user = {
            userId: payload.userId,
            role: payload.role,
        };
        Logger_1.Logger.debug("Authentication successful", {
            userId: payload.userId,
            role: payload.role,
        });
        next();
    }
    catch (error) {
        Logger_1.Logger.error("Authentication middleware error", error);
        const response = {
            success: false,
            message: AuthConstants_1.AuthMessages.AUTHENTICATION_FAILED,
        };
        res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json(response);
    }
};
exports.authMiddleware = authMiddleware;
// Role-based authorization middleware
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            const response = {
                success: false,
                message: AuthConstants_1.AuthMessages.AUTHENTICATION_FAILED,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json(response);
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            const response = {
                success: false,
                message: "Insufficient permissions",
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN).json(response);
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=AuthMiddleware.js.map