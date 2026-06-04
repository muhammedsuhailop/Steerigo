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
exports.TokenManagementService = void 0;
const inversify_1 = require("inversify");
const RefreshToken_1 = require("../../domain/entities/RefreshToken");
const uuid_1 = require("uuid");
const DITypes_1 = require("../../shared/constants/DITypes");
let TokenManagementService = class TokenManagementService {
    constructor(tokenService, refreshTokenRepository) {
        this.tokenService = tokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    generateAccessToken(payload) {
        return this.tokenService.generateAccessToken(payload);
    }
    generateRefreshToken() {
        return this.tokenService.generateRefreshToken();
    }
    createRefreshTokenEntity(userId, token, expiresAt) {
        return RefreshToken_1.RefreshToken.create({
            id: (0, uuid_1.v4)(),
            userId,
            token,
            expiresAt,
        });
    }
    async cleanupUserRefreshTokens(userId) {
        await this.refreshTokenRepository.deleteByUserId(userId);
    }
    async saveRefreshToken(refreshToken) {
        await this.refreshTokenRepository.save(refreshToken);
    }
};
exports.TokenManagementService = TokenManagementService;
exports.TokenManagementService = TokenManagementService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.TokenService)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RefreshTokenRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TokenManagementService);
//# sourceMappingURL=TokenManagementService.js.map