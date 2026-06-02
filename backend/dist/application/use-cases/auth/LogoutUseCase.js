"use strict";
// src/application/use-cases/auth/LogoutUseCase.ts
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
exports.LogoutUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
/**
 * Logout Use Case
 *
 * Handles user logout by revoking the refresh token.
 * Implements IUseCase interface with RefreshTokenDto input and void output.
 *
 * @implements IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>
 */
let LogoutUseCase = class LogoutUseCase {
    constructor(refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Logout attempt started");
            const refreshToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);
            if (refreshToken && refreshToken.isValid()) {
                refreshToken.revoke();
                await this.refreshTokenRepository.save(refreshToken);
                Logger_1.Logger.info("Refresh token revoked successfully");
            }
            return Result_1.Result.success();
        }
        catch (error) {
            Logger_1.Logger.error("Logout use case error", {
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.LogoutUseCase = LogoutUseCase;
exports.LogoutUseCase = LogoutUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenRepository)),
    __metadata("design:paramtypes", [Object])
], LogoutUseCase);
//# sourceMappingURL=LogoutUseCase.js.map