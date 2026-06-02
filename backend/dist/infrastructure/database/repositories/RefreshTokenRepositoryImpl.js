"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const RefreshToken_1 = require("@domain/entities/RefreshToken");
const RefreshTokenModel_1 = require("../models/RefreshTokenModel");
const Logger_1 = require("@shared/utils/Logger");
let RefreshTokenRepositoryImpl = class RefreshTokenRepositoryImpl {
    async findByToken(token) {
        try {
            const tokenDoc = await RefreshTokenModel_1.RefreshTokenModel.findOne({ token });
            return tokenDoc ? this.toDomain(tokenDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding refresh token", { token, error });
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            const tokenDocs = await RefreshTokenModel_1.RefreshTokenModel.find({
                userId,
                isRevoked: false,
            }).sort({ createdAt: -1 });
            return tokenDocs.map((doc) => this.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding refresh tokens by user ID", {
                userId,
                error,
            });
            throw error;
        }
    }
    async save(refreshToken) {
        try {
            const tokenData = this.toPersistence(refreshToken);
            const savedToken = await RefreshTokenModel_1.RefreshTokenModel.findOneAndUpdate({ token: refreshToken.getToken() }, tokenData, { upsert: true, new: true });
            Logger_1.Logger.info("Refresh token saved successfully", {
                tokenId: refreshToken.getId(),
            });
            return this.toDomain(savedToken);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving refresh token", {
                tokenId: refreshToken.getId(),
                error,
            });
            throw error;
        }
    }
    async deleteByToken(token) {
        try {
            await RefreshTokenModel_1.RefreshTokenModel.deleteOne({ token });
            Logger_1.Logger.info("Refresh token deleted successfully", { token });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting refresh token", { token, error });
            throw error;
        }
    }
    async deleteByUserId(userId) {
        try {
            await RefreshTokenModel_1.RefreshTokenModel.deleteMany({ userId });
            Logger_1.Logger.info("All refresh tokens deleted for user", { userId });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting refresh tokens by user ID", {
                userId,
                error,
            });
            throw error;
        }
    }
    async deleteExpiredTokens() {
        try {
            const result = await RefreshTokenModel_1.RefreshTokenModel.deleteMany({
                expiresAt: { $lt: new Date() },
            });
            Logger_1.Logger.info("Expired refresh tokens cleaned up", {
                deletedCount: result.deletedCount,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error cleaning up expired refresh tokens", error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const tokenDoc = await RefreshTokenModel_1.RefreshTokenModel.findById(id);
            return tokenDoc ? this.toDomain(tokenDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding refresh token by ID", { id, error });
            throw error;
        }
    }
    async delete(id) {
        try {
            await RefreshTokenModel_1.RefreshTokenModel.findByIdAndDelete(id);
            Logger_1.Logger.info("Refresh token deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting refresh token by ID", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await RefreshTokenModel_1.RefreshTokenModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking if refresh token exists", { id, error });
            throw error;
        }
    }
    async findAll(options) {
        try {
            const tokenDocs = await RefreshTokenModel_1.RefreshTokenModel.find({})
                .limit(options?.limit || 100)
                .skip(options?.offset || 0);
            return tokenDocs.map((doc) => this.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all refresh tokens", error);
            throw error;
        }
    }
    async findPaginated(options) {
        try {
            const limit = options.limit || 10;
            const offset = options.offset || 0;
            const page = Math.floor(offset / limit) + 1;
            const [tokens, total] = await Promise.all([
                this.findAll(options),
                this.count(options.filters),
            ]);
            return {
                data: tokens,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated refresh tokens", error);
            throw error;
        }
    }
    async count(filters) {
        try {
            return await RefreshTokenModel_1.RefreshTokenModel.countDocuments(filters || {});
        }
        catch (error) {
            Logger_1.Logger.error("Error counting refresh tokens", error);
            throw error;
        }
    }
    async updateById(id, updates) {
        try {
            await RefreshTokenModel_1.RefreshTokenModel.findByIdAndUpdate(id, updates);
            Logger_1.Logger.info("Refresh token updated successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error updating refresh token", { id, error });
            throw error;
        }
    }
    async deleteMany(filters) {
        try {
            const result = await RefreshTokenModel_1.RefreshTokenModel.deleteMany(filters);
            Logger_1.Logger.info("Refresh tokens deleted successfully", { filters });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting refresh tokens", { filters, error });
            throw error;
        }
    }
    async updateMany(filters, updates) {
        try {
            const result = await RefreshTokenModel_1.RefreshTokenModel.updateMany(filters, updates);
            Logger_1.Logger.info("Refresh token updated successfully", { filters, updates });
            return result.modifiedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error updating multiple refesh tokens", {
                filters,
                updates,
                error,
            });
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const refreshTokens = await RefreshTokenModel_1.RefreshTokenModel.find({ _id: { $in: ids } });
            return refreshTokens.map((token) => this.toDomain(token));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding refresh tokens", { ids, error });
            throw error;
        }
    }
    async existsByFilter(filters) {
        try {
            const count = await RefreshTokenModel_1.RefreshTokenModel.countDocuments(filters);
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking existence by filter", { filters, error });
            throw error;
        }
    }
    toDomain(tokenDoc) {
        return RefreshToken_1.RefreshToken.reconstruct({
            id: tokenDoc.id.toString(),
            userId: tokenDoc.userId.toString(),
            token: tokenDoc.token,
            expiresAt: tokenDoc.expiresAt,
            isRevoked: tokenDoc.isRevoked,
            createdAt: tokenDoc.createdAt,
            updatedAt: tokenDoc.updatedAt,
        });
    }
    toPersistence(refreshToken) {
        return {
            userId: refreshToken.getUserId(),
            token: refreshToken.getToken(),
            expiresAt: refreshToken.getExpiresAt(),
            isRevoked: refreshToken.getIsRevoked(),
            updatedAt: refreshToken.getUpdatedAt(),
        };
    }
};
exports.RefreshTokenRepositoryImpl = RefreshTokenRepositoryImpl;
exports.RefreshTokenRepositoryImpl = RefreshTokenRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], RefreshTokenRepositoryImpl);
//# sourceMappingURL=RefreshTokenRepositoryImpl.js.map