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
exports.ForgotPasswordVerifyUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const errors_1 = require("../../../domain/errors");
const Password_1 = require("../../../domain/value-objects/Password");
let ForgotPasswordVerifyUseCase = class ForgotPasswordVerifyUseCase {
    constructor(userRepository, passwordService, emailService, otpService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Forgot password verify started", { email: dto.getEmail() });
            const user = await this.userRepository.findByEmail(dto.getEmail());
            if (!user) {
                Logger_1.Logger.warn("Forgot password verify failed - user not found", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.UserNotFoundError());
            }
            if (user.isResetOtpExpired()) {
                Logger_1.Logger.warn("Forgot password verify failed - OTP expired", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.OtpExpiredError());
            }
            if (!user.canAttemptResetOtp()) {
                Logger_1.Logger.warn("Forgot password verify failed - max attempts exceeded", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.MaxOtpAttemptsError());
            }
            // Verify OTP
            const resetOtpHash = user.getResetOtpHash();
            if (!resetOtpHash) {
                Logger_1.Logger.warn("Forgot password verify failed - no reset OTP hash", {
                    email: dto.getEmail(),
                });
                return Result_1.Result.failure(new errors_1.DomainError(AuthConstants_1.AuthErrorMessages.OTP_NOT_FOUND));
            }
            const isOtpValid = await this.otpService.verify(dto.getOtp(), resetOtpHash);
            if (!isOtpValid) {
                user.incrementResetOtpAttempts();
                await this.userRepository.save(user);
                Logger_1.Logger.warn("Forgot password verify failed - invalid OTP", {
                    email: dto.getEmail(),
                    attempts: user.getOtpAttempts(),
                });
                return Result_1.Result.failure(new errors_1.DomainError(AuthConstants_1.AuthErrorMessages.OTP_INVALID));
            }
            // Validate password strength
            if (!this.passwordService.validatePasswordStrength(dto.getNewPassword())) {
                return Result_1.Result.failure(new errors_1.PasswordResetError("Password does not meet security requirements"));
            }
            // Hash new password and update user
            const newPasswordHash = await this.passwordService.hash(dto.getNewPassword());
            const passwordVO = Password_1.Password.createFromHash(newPasswordHash);
            user.updatePassword(passwordVO);
            await this.userRepository.save(user);
            // Send confirmation email
            await this.emailService.sendPasswordResetConfirmation(dto.getEmail(), user.getName());
            Logger_1.Logger.info("Forgot password verify completed successfully", {
                email: dto.getEmail(),
                userId: user.getId(),
            });
            return Result_1.Result.success();
        }
        catch (error) {
            Logger_1.Logger.error("Forgot password verify use case error", {
                email: dto.getEmail(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.ForgotPasswordVerifyUseCase = ForgotPasswordVerifyUseCase;
exports.ForgotPasswordVerifyUseCase = ForgotPasswordVerifyUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PasswordService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EmailService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ForgotPasswordVerifyUseCase);
//# sourceMappingURL=ForgotPasswordVerifyUseCase.js.map