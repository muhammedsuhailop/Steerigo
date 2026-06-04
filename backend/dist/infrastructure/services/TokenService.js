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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const Logger_1 = require("@shared/utils/Logger");
let TokenService = class TokenService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "";
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
        if (!this.jwtSecret || !this.refreshTokenSecret) {
            throw new Error("JWT_SECRET and REFRESH_TOKEN_SECRET environment variables are required");
        }
    }
    generateAccessToken(payload) {
        try {
            const token = jsonwebtoken_1.default.sign({
                userId: payload.userId,
                role: payload.role,
                type: "access",
            }, this.jwtSecret, {
                expiresIn: AuthConstants_1.TokenConfig.ACCESS_TOKEN_EXPIRES_IN,
                issuer: AuthConstants_1.TokenConfig.JWT_ISSUER,
                audience: AuthConstants_1.TokenConfig.JWT_AUDIENCE,
            });
            Logger_1.Logger.debug("Access token generated successfully", {
                userId: payload.userId,
            });
            return token;
        }
        catch (error) {
            Logger_1.Logger.error("Error generating access token", error);
            throw new Error("Failed to generate access token");
        }
    }
    generateRefreshToken() {
        try {
            const randomBytes = crypto_1.default.randomBytes(64);
            const refreshToken = randomBytes.toString("hex");
            Logger_1.Logger.debug("Refresh token generated successfully");
            return refreshToken;
        }
        catch (error) {
            Logger_1.Logger.error("Error generating refresh token", error);
            throw new Error("Failed to generate refresh token");
        }
    }
    verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret, {
                issuer: AuthConstants_1.TokenConfig.JWT_ISSUER,
                audience: AuthConstants_1.TokenConfig.JWT_AUDIENCE,
            });
            if (decoded.type !== "access") {
                Logger_1.Logger.warn("Invalid token type", { type: decoded.type });
                return null;
            }
            return {
                userId: decoded.userId,
                role: decoded.role,
                iat: decoded.iat,
                exp: decoded.exp,
            };
        }
        catch (error) {
            Logger_1.Logger.debug("Access token verification failed", error);
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return typeof token === "string" && token.length === 128; // 64 bytes = 128 hex chars
        }
        catch (error) {
            Logger_1.Logger.error("Error verifying refresh token", error);
            return false;
        }
    }
    getTokenExpiration(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || typeof decoded === "string" || !decoded.exp) {
                return null;
            }
            return new Date(decoded.exp * 1000);
        }
        catch (error) {
            Logger_1.Logger.error("Error getting token expiration", error);
            return null;
        }
    }
    generateTokenPair(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken();
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TokenService);
//# sourceMappingURL=TokenService.js.map