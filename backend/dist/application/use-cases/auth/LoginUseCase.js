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
exports.LoginUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const errors_1 = require("@domain/errors");
const Logger_1 = require("@shared/utils/Logger");
const AccountStatusErrorFactory_1 = require("@domain/errors/strategies/AccountStatusErrorFactory");
let LoginUseCase = class LoginUseCase {
    constructor(userRepository, passwordService, tokenManagementService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenManagementService = tokenManagementService;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Login attempt started", { email: dto.getEmailValue() });
            const userValidationResult = await this.validateUser(dto);
            if (userValidationResult.isFailure()) {
                return userValidationResult;
            }
            const user = userValidationResult.getValue();
            const accessToken = this.tokenManagementService.generateAccessToken({
                userId: user.getId(),
                role: user.getRole(),
            });
            const refreshTokenValue = this.tokenManagementService.generateRefreshToken();
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await this.tokenManagementService.cleanupUserRefreshTokens(user.getId());
            const refreshToken = this.tokenManagementService.createRefreshTokenEntity(user.getId(), refreshTokenValue, refreshTokenExpiry);
            await this.tokenManagementService.saveRefreshToken(refreshToken);
            const response = {
                accessToken,
                refreshToken: refreshTokenValue,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmailValue(),
                    role: user.getRole(),
                    status: user.getStatus(),
                    mobile: user.getMobile(),
                    profilePicture: user.getProfilePicture(),
                    isVerified: user.getIsVerified(),
                },
                expiresIn: 3600,
            };
            Logger_1.Logger.info("Login successful", {
                userId: user.getId(),
                email: dto.getEmailValue(),
                role: user.getRole(),
            });
            return Result_1.Result.success(response);
        }
        catch (err) {
            Logger_1.Logger.error("Login use case error", {
                email: dto.getEmailValue(),
                error: err instanceof Error ? err.message : String(err),
            });
            return Result_1.Result.failure(err instanceof Error ? err : new Error(String(err)));
        }
    }
    async validateUser(dto) {
        const user = await this.userRepository.findByEmail(dto.getEmailValue());
        if (!user) {
            Logger_1.Logger.warn("Login failed - user not found", {
                email: dto.getEmailValue(),
            });
            return Result_1.Result.failure(new errors_1.InvalidCredentialsError());
        }
        if (!user.canLogin()) {
            const reason = user.getIsVerified()
                ? "Account status invalid"
                : "Account not verified";
            Logger_1.Logger.warn("Login failed - account state invalid", {
                email: dto.getEmailValue(),
                status: user.getStatus(),
                isVerified: user.getIsVerified(),
                reason,
            });
            return Result_1.Result.failure(AccountStatusErrorFactory_1.AccountStatusErrorFactory.createError(user.getStatus()));
        }
        if (!user.isGoogleUser()) {
            const isPasswordValid = await this.passwordService.compare(dto.getPassword(), user.getPasswordHash());
            if (!isPasswordValid) {
                Logger_1.Logger.warn("Login failed - invalid password", {
                    email: dto.getEmailValue(),
                });
                return Result_1.Result.failure(new errors_1.InvalidCredentialsError());
            }
        }
        return Result_1.Result.success(user);
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PasswordService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.TokenManagementService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LoginUseCase);
//# sourceMappingURL=LoginUseCase.js.map