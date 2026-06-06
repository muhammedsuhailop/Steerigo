"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenController = void 0;
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../../application/dto/auth");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
let TokenController = class TokenController {
    constructor(logoutUseCase, refreshTokenUseCase) {
        this.logoutUseCase = logoutUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }
    async logout(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            // Get refresh token from httpOnly cookie
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: AuthConstants_1.AuthMessages.REFRESH_TOKEN_REQUIRED,
                });
                return;
            }
            const dto = auth_1.RefreshTokenDto.fromRequest({ refreshToken });
            const result = await this.logoutUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "logout");
                res.status(statusCode).json(response);
                return;
            }
            // Clear the refresh token cookie
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                path: "/",
            });
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.LOGOUT_SUCCESS,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("User logged out successfully");
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "logout");
            res.status(statusCode).json(response);
        }
    }
    async refreshToken(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: AuthConstants_1.AuthMessages.REFRESH_TOKEN_REQUIRED,
                });
                return;
            }
            const dto = auth_1.RefreshTokenDto.fromRequest({ refreshToken });
            const result = await this.refreshTokenUseCase.execute(dto);
            if (result.isFailure()) {
                // Clear invalid cookie
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                    path: "/",
                });
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "refresh_token");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true, // Cannot be accessed by JavaScript
                secure: process.env.NODE_ENV === "production", // HTTPS only in production
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/", // Available for all routes
            });
            // Send access token in response body
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.TOKENS_REFRESHED,
                data: {
                    accessToken: data.accessToken,
                },
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Tokens refreshed successfully");
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "refresh_token");
            res.status(statusCode).json(response);
        }
    }
};
exports.TokenController = TokenController;
exports.TokenController = TokenController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.LogoutUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], TokenController);
//# sourceMappingURL=TokenController.js.map