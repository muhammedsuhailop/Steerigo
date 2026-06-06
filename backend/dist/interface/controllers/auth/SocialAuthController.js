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
exports.SocialAuthController = void 0;
const inversify_1 = require("inversify");
const GoogleLoginRequestDto_1 = require("../../../application/dto/auth/GoogleLoginRequestDto");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const CookieHelper_1 = require("../../../shared/utils/CookieHelper");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
let SocialAuthController = class SocialAuthController {
    constructor(getGoogleAuthUrlUseCase, googleLoginUseCase) {
        this.getGoogleAuthUrlUseCase = getGoogleAuthUrlUseCase;
        this.googleLoginUseCase = googleLoginUseCase;
    }
    async getGoogleAuthUrl(req, res) {
        try {
            const result = await this.getGoogleAuthUrlUseCase.execute();
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.GOOGLE_AUTH_URL_SUCCESS,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Google auth URL generated successfully");
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async googleLogin(req, res) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4001";
        try {
            const code = req.query.code;
            if (!code) {
                Logger_1.Logger.warn("Google login - authorization code missing");
                return res.redirect(`${frontendUrl}/login?error=missing_code`);
            }
            const dto = new GoogleLoginRequestDto_1.GoogleLoginRequestDto({ code });
            const result = await this.googleLoginUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.error("Google login failed", {
                    error: error.message,
                    stack: error.stack,
                });
                // Redirect to frontend with error
                return res.redirect(`${frontendUrl}/login?error=auth_failed`);
            }
            const data = result.getValue();
            CookieHelper_1.CookieHelper.setRefreshTokenCookie(res, data.refreshToken);
            const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
            redirectUrl.searchParams.set("accessToken", data.accessToken);
            redirectUrl.searchParams.set("role", data.user.role);
            redirectUrl.searchParams.set("isNewUser", String(data.isNewUser));
            Logger_1.Logger.info("Google login successful - redirecting to callback", {
                userId: data.user.id,
                email: data.user.email,
                role: data.user.role,
                isNewUser: data.isNewUser,
            });
            // Redirect to frontend auth callback with access token in URL
            return res.redirect(redirectUrl.toString());
        }
        catch (error) {
            Logger_1.Logger.error("Google login controller error", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            // Redirect to frontend with error
            return res.redirect(`${frontendUrl}/login?error=server_error`);
        }
    }
};
exports.SocialAuthController = SocialAuthController;
exports.SocialAuthController = SocialAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetGoogleAuthUrlUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GoogleLoginUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], SocialAuthController);
//# sourceMappingURL=SocialAuthController.js.map