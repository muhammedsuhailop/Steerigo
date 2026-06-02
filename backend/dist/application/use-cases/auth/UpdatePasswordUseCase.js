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
exports.UpdatePasswordUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const errors_1 = require("../../../domain/errors");
const Password_1 = require("../../../domain/value-objects/Password");
let UpdatePasswordUseCase = class UpdatePasswordUseCase {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Update password started", { userId: dto.getUserId() });
            const user = await this.userRepository.findById(dto.getUserId());
            if (!user) {
                Logger_1.Logger.warn("Update password failed - user not found", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new errors_1.UserNotFoundError());
            }
            if (user.isGoogleUser()) {
                Logger_1.Logger.warn("Update password failed - Google user", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new errors_1.DomainError("Google users cannot change password"));
            }
            // Verify current password
            const isCurrentPasswordValid = await this.passwordService.compare(dto.getCurrentPassword(), user.getPasswordHash());
            if (!isCurrentPasswordValid) {
                Logger_1.Logger.warn("Update password failed - invalid current password", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new errors_1.InvalidCredentialsError());
            }
            // Check if new password is same as current
            const isSamePassword = await this.passwordService.compare(dto.getNewPassword(), user.getPasswordHash());
            if (isSamePassword) {
                Logger_1.Logger.warn("Update password failed - same as current password", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new errors_1.DomainError("New password must be different from current password"));
            }
            // Validate new password strength
            if (!this.passwordService.validatePasswordStrength(dto.getNewPassword())) {
                Logger_1.Logger.warn("Update password failed - weak password", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new errors_1.PasswordResetError("Password does not meet security requirements"));
            }
            // Hash new password and update
            const newPasswordHash = await this.passwordService.hash(dto.getNewPassword());
            const passwordVO = Password_1.Password.createFromHash(newPasswordHash);
            user.updatePassword(passwordVO);
            await this.userRepository.save(user);
            Logger_1.Logger.info("Update password completed successfully", {
                userId: dto.getUserId(),
            });
            return Result_1.Result.success();
        }
        catch (error) {
            Logger_1.Logger.error("Update password use case error", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.UpdatePasswordUseCase = UpdatePasswordUseCase;
exports.UpdatePasswordUseCase = UpdatePasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PasswordService)),
    __metadata("design:paramtypes", [Object, Object])
], UpdatePasswordUseCase);
//# sourceMappingURL=UpdatePasswordUseCase.js.map