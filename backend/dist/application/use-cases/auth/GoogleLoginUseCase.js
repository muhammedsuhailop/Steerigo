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
exports.GoogleLoginUseCase = void 0;
const inversify_1 = require("inversify");
const User_1 = require("@domain/entities/User");
const RefreshToken_1 = require("@domain/entities/RefreshToken");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const errors_1 = require("@domain/errors");
const uuid_1 = require("uuid");
let GoogleLoginUseCase = class GoogleLoginUseCase {
    constructor(googleAuthService, userRepository, tokenService, refreshTokenRepository, emailService) {
        this.googleAuthService = googleAuthService;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailService = emailService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Google login attempt started");
            Logger_1.Logger.debug("dto.getCode", dto.getCode());
            const tokens = await this.googleAuthService.exchangeCodeForTokens(dto.getCode());
            const googleProfile = await this.googleAuthService.getUserProfile(tokens.access_token);
            if (!googleProfile.verified_email) {
                Logger_1.Logger.warn("Google login failed - email not verified", {
                    email: googleProfile.email,
                });
                return Result_1.Result.failure(new errors_1.EmailNotVerifiedError());
            }
            let user = await this.userRepository.findByGoogleId(googleProfile.id);
            let isNewUser = false;
            if (!user) {
                const existingEmailUser = await this.userRepository.findByEmail(googleProfile.email);
                if (existingEmailUser && !existingEmailUser.isGoogleUser()) {
                    Logger_1.Logger.warn("Google login failed - email already registered", {
                        email: googleProfile.email,
                    });
                    return Result_1.Result.failure(new errors_1.DomainError("Email already registered. Please use email/password login."));
                }
                user = User_1.User.createFromGoogle({
                    id: (0, uuid_1.v4)(),
                    googleId: googleProfile.id,
                    name: googleProfile.name,
                    email: googleProfile.email,
                    profilePicture: googleProfile.picture,
                });
                await this.userRepository.save(user);
                isNewUser = true;
                // Send welcome email for new users
                await this.emailService.sendWelcomeEmail(user.getEmailValue(), user.getName());
                Logger_1.Logger.info("New Google user created", {
                    email: user.getEmailValue(),
                    googleId: googleProfile.id,
                });
            }
            else {
                // Update profile picture if changed
                if (googleProfile.picture &&
                    googleProfile.picture !== user.getProfilePicture()) {
                    user.updateProfilePicture(googleProfile.picture);
                    await this.userRepository.save(user);
                }
                Logger_1.Logger.info("Existing Google user logged in", {
                    email: user.getEmailValue(),
                });
            }
            const accessToken = this.tokenService.generateAccessToken({
                userId: user.getId(),
                role: user.getRole(),
            });
            const refreshTokenValue = this.tokenService.generateRefreshToken();
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await this.refreshTokenRepository.deleteByUserId(user.getId());
            const refreshToken = RefreshToken_1.RefreshToken.create({
                id: (0, uuid_1.v4)(),
                userId: user.getId(),
                token: refreshTokenValue,
                expiresAt: refreshTokenExpiry,
            });
            await this.refreshTokenRepository.save(refreshToken);
            const response = {
                accessToken,
                refreshToken: refreshTokenValue,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmailValue(),
                    role: user.getRole(),
                    status: user.getStatus(),
                    mobile: user.getMobile() ?? "",
                    profilePicture: user.getProfilePicture(),
                    isVerified: user.getIsVerified(),
                },
                expiresIn: 3600,
                isNewUser,
            };
            Logger_1.Logger.info("Google login successful", {
                userId: user.getId(),
                email: user.getEmailValue(),
                isNewUser,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Google login use case error", {
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GoogleLoginUseCase = GoogleLoginUseCase;
exports.GoogleLoginUseCase = GoogleLoginUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GoogleAuthService)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.TokenService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EmailService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GoogleLoginUseCase);
//# sourceMappingURL=GoogleLoginUseCase.js.map