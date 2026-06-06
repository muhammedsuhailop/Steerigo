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
exports.ForgotPasswordRequestUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const AppConstants_1 = require("../../../shared/constants/AppConstants");
const errors_1 = require("../../../domain/errors");
let ForgotPasswordRequestUseCase = class ForgotPasswordRequestUseCase {
    constructor(userRepository, passwordService, emailService, otpService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Forgot password request started", { email: dto.getEmail() });
            const user = await this.userRepository.findByEmail(dto.getEmail());
            if (!user) {
                Logger_1.Logger.warn("Forgot password failed - user not found", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.UserNotFoundError());
            }
            if (!user.getIsVerified()) {
                Logger_1.Logger.warn("Forgot password failed - user not verified", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.DomainError(AuthConstants_1.AuthErrorMessages.EMAIL_NOT_VERIFIED));
            }
            if (user.isGoogleUser()) {
                Logger_1.Logger.warn("Forgot password failed - Google user", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.DomainError("Google users cannot reset password. Please sign in with Google."));
            }
            // Generate and set reset OTP
            const otp = this.otpService.generate();
            const otpHash = await this.otpService.hash(otp);
            const otpExpires = new Date(Date.now() + AppConstants_1.AppConstants.OTP_TTL_SECONDS * 1000);
            user.setResetOtpDetails(otpHash, otpExpires);
            await this.userRepository.save(user);
            // Send reset OTP email
            await this.emailService.sendPasswordResetOtp(dto.getEmail(), otp, user.getName());
            Logger_1.Logger.info("Forgot password request completed successfully", {
                email: dto.getEmail(),
                userId: user.getId(),
            });
            return Result_1.Result.success();
        }
        catch (error) {
            Logger_1.Logger.error("Forgot password request use case error", {
                email: dto.getEmail(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.ForgotPasswordRequestUseCase = ForgotPasswordRequestUseCase;
exports.ForgotPasswordRequestUseCase = ForgotPasswordRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PasswordService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EmailService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ForgotPasswordRequestUseCase);
//# sourceMappingURL=ForgotPasswordRequestUseCase.js.map