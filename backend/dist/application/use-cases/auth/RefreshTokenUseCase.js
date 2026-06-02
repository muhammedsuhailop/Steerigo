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
exports.RefreshTokenUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const errors_1 = require("../../../domain/errors");
const RefreshToken_1 = require("../../../domain/entities/RefreshToken");
const uuid_1 = require("uuid");
const DITypes_1 = require("../../../shared/constants/DITypes");
let RefreshTokenUseCase = class RefreshTokenUseCase {
    constructor(refreshTokenRepository, userRepository, tokenService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async execute(dto) {
        try {
            const oldToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);
            if (!oldToken) {
                return Result_1.Result.failure(new errors_1.DomainError("Invalid refresh token"));
            }
            if (!oldToken.isValid()) {
                if (oldToken.isExpired()) {
                    return Result_1.Result.failure(new errors_1.RefreshTokenExpiredError());
                }
                else {
                    return Result_1.Result.failure(new errors_1.RefreshTokenRevokedError());
                }
            }
            const user = await this.userRepository.findById(oldToken.getUserId());
            if (!user || !user.getIsVerified()) {
                return Result_1.Result.failure(new errors_1.DomainError("User not found or not verified"));
            }
            const accessToken = this.tokenService.generateAccessToken({
                userId: user.getId(),
                role: user.getRole(),
            });
            oldToken.revoke();
            await this.refreshTokenRepository.save(oldToken);
            const newTokenValue = this.tokenService.generateRefreshToken();
            const newTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const newToken = RefreshToken_1.RefreshToken.create({
                id: (0, uuid_1.v4)(),
                userId: user.getId(),
                token: newTokenValue,
                expiresAt: newTokenExpiry,
            });
            await this.refreshTokenRepository.save(newToken);
            return Result_1.Result.success({
                accessToken,
                refreshToken: newTokenValue,
            });
        }
        catch (error) {
            return Result_1.Result.failure(error);
        }
    }
};
exports.RefreshTokenUseCase = RefreshTokenUseCase;
exports.RefreshTokenUseCase = RefreshTokenUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.TokenService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RefreshTokenUseCase);
//# sourceMappingURL=RefreshTokenUseCase.js.map