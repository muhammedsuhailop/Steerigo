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
exports.SignupVerifyUseCase = void 0;
const inversify_1 = require("inversify");
const errors_1 = require("../../../domain/errors");
const RefreshToken_1 = require("../../../domain/entities/RefreshToken");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const uuid_1 = require("uuid");
let SignupVerifyUseCase = class SignupVerifyUseCase {
    constructor(userRepository, refreshTokenRepository, otpService, tokenService, emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.otpService = otpService;
        this.tokenService = tokenService;
        this.emailService = emailService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Signup verification started", { email: dto.getEmail() });
            const user = await this.userRepository.findByEmail(dto.getEmail());
            if (!user) {
                Logger_1.Logger.warn("Signup verify failed - user not found", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.DomainError("No signup request found for this email"));
            }
            if (user.getIsVerified()) {
                Logger_1.Logger.warn("Signup verify failed - already verified", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.DomainError("User is already verified"));
            }
            if (user.isOtpExpired()) {
                Logger_1.Logger.warn("Signup verify failed - OTP expired", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.OtpExpiredError());
            }
            if (!user.canAttemptOtpVerification()) {
                Logger_1.Logger.warn("Signup verify failed - max attempts exceeded", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.MaxOtpAttemptsError());
            }
            // Verify OTP
            const otpHash = user.getOtpHash();
            if (!otpHash) {
                Logger_1.Logger.warn("Signup verify failed - no OTP hash", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.OtpNotFoundError());
            }
            const isOtpValid = await this.otpService.verify(dto.getOtp(), otpHash);
            if (!isOtpValid) {
                user.incrementOtpAttempts();
                await this.userRepository.save(user);
                Logger_1.Logger.warn("Signup verify failed - invalid OTP", {
                    email: dto.getEmail(),
                    attempts: user.getOtpAttempts(),
                });
                return Result_1.Result.failure(new errors_1.DomainError(AuthConstants_1.AuthErrorMessages.OTP_INVALID));
            }
            // Verify user
            user.markEmailAsVerified();
            await this.userRepository.save(user);
            // Generate tokens
            const accessToken = this.tokenService.generateAccessToken({
                userId: user.getId(),
                role: user.getRole(),
            });
            const refreshTokenValue = this.tokenService.generateRefreshToken();
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            // Clean up existing refresh tokens
            await this.refreshTokenRepository.deleteByUserId(user.getId());
            // Create new refresh token
            const refreshToken = RefreshToken_1.RefreshToken.create({
                id: (0, uuid_1.v4)(),
                userId: user.getId(),
                token: refreshTokenValue,
                expiresAt: refreshTokenExpiry,
            });
            await this.refreshTokenRepository.save(refreshToken);
            // Send welcome email
            await this.emailService.sendWelcomeEmail(user.getEmailValue(), user.getName());
            const response = {
                accessToken,
                refreshToken: refreshTokenValue,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmailValue(),
                    mobile: user.getMobile() ?? "",
                    role: user.getRole(),
                    status: user.getStatus(),
                    profilePicture: user.getProfilePicture(),
                    isVerified: user.getIsVerified(),
                },
                expiresIn: 3600, // 1 hour in seconds
            };
            Logger_1.Logger.info("Signup verification completed successfully", {
                userId: user.getId(),
                email: dto.getEmail(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Signup verify use case error", {
                email: dto.getEmail(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.SignupVerifyUseCase = SignupVerifyUseCase;
exports.SignupVerifyUseCase = SignupVerifyUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.TokenService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EmailService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], SignupVerifyUseCase);
//# sourceMappingURL=SignupVerifyUseCase.js.map