import { injectable } from "inversify";
import { RefreshTokenRepository } from "@domain/repositories/RefreshTokenRepository";
import { RefreshToken } from "@domain/entities/RefreshToken";
import {
  RefreshTokenModel,
  IRefreshTokenDocument,
} from "../models/RefreshTokenModel";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  async findByToken(token: string): Promise<RefreshToken | null> {
    try {
      const tokenDoc = await RefreshTokenModel.findOne({ token });
      return tokenDoc ? this.toDomain(tokenDoc) : null;
    } catch (error) {
      Logger.error("Error finding refresh token", { token, error });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    try {
      const tokenDocs = await RefreshTokenModel.find({
        userId,
        isRevoked: false,
      }).sort({ createdAt: -1 });

      return tokenDocs.map((doc) => this.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding refresh tokens by user ID", {
        userId,
        error,
      });
      throw error;
    }
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    try {
      const tokenData = this.toPersistence(refreshToken);
      await RefreshTokenModel.findOneAndUpdate(
        { token: refreshToken.getToken() },
        tokenData,
        { upsert: true, new: true }
      );
      Logger.info("Refresh token saved successfully", {
        tokenId: refreshToken.getId(),
      });
    } catch (error) {
      Logger.error("Error saving refresh token", {
        tokenId: refreshToken.getId(),
        error,
      });
      throw error;
    }
  }

  async deleteByToken(token: string): Promise<void> {
    try {
      await RefreshTokenModel.deleteOne({ token });
      Logger.info("Refresh token deleted successfully", { token });
    } catch (error) {
      Logger.error("Error deleting refresh token", { token, error });
      throw error;
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await RefreshTokenModel.deleteMany({ userId });
      Logger.info("All refresh tokens deleted for user", { userId });
    } catch (error) {
      Logger.error("Error deleting refresh tokens by user ID", {
        userId,
        error,
      });
      throw error;
    }
  }

  async deleteExpiredTokens(): Promise<void> {
    try {
      const result = await RefreshTokenModel.deleteMany({
        expiresAt: { $lt: new Date() },
      });
      Logger.info("Expired refresh tokens cleaned up", {
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      Logger.error("Error cleaning up expired refresh tokens", error);
      throw error;
    }
  }

  // Add base repository methods to satisfy the interface
  async findById(id: string): Promise<RefreshToken | null> {
    try {
      const tokenDoc = await RefreshTokenModel.findById(id);
      return tokenDoc ? this.toDomain(tokenDoc) : null;
    } catch (error) {
      Logger.error("Error finding refresh token by ID", { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await RefreshTokenModel.findByIdAndDelete(id);
      Logger.info("Refresh token deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting refresh token by ID", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RefreshTokenModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking if refresh token exists", { id, error });
      throw error;
    }
  }

  async findAll(options?: any): Promise<RefreshToken[]> {
    try {
      const tokenDocs = await RefreshTokenModel.find({})
        .limit(options?.limit || 100)
        .skip(options?.offset || 0);
      return tokenDocs.map((doc) => this.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding all refresh tokens", error);
      throw error;
    }
  }

  async findPaginated(options: any): Promise<any> {
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
    } catch (error) {
      Logger.error("Error finding paginated refresh tokens", error);
      throw error;
    }
  }

  async count(filters?: Record<string, any>): Promise<number> {
    try {
      return await RefreshTokenModel.countDocuments(filters || {});
    } catch (error) {
      Logger.error("Error counting refresh tokens", error);
      throw error;
    }
  }

  async updateById(id: string, updates: any): Promise<void> {
    try {
      await RefreshTokenModel.findByIdAndUpdate(id, updates);
      Logger.info("Refresh token updated successfully", { id });
    } catch (error) {
      Logger.error("Error updating refresh token", { id, error });
      throw error;
    }
  }

  async deleteMany(filters: Record<string, any>): Promise<void> {
    try {
      await RefreshTokenModel.deleteMany(filters);
      Logger.info("Refresh tokens deleted successfully", { filters });
    } catch (error) {
      Logger.error("Error deleting refresh tokens", { filters, error });
      throw error;
    }
  }

  private toDomain(tokenDoc: IRefreshTokenDocument): RefreshToken {
    return RefreshToken.reconstruct({
      id: tokenDoc.id.toString(),
      userId: tokenDoc.userId.toString(),
      token: tokenDoc.token,
      expiresAt: tokenDoc.expiresAt,
      isRevoked: tokenDoc.isRevoked,
      createdAt: tokenDoc.createdAt,
      updatedAt: tokenDoc.updatedAt,
    });
  }

  private toPersistence(
    refreshToken: RefreshToken
  ): Partial<IRefreshTokenDocument> {
    return {
      userId: refreshToken.getUserId() as any,
      token: refreshToken.getToken(),
      expiresAt: refreshToken.getExpiresAt(),
      isRevoked: refreshToken.getIsRevoked(),
      updatedAt: refreshToken.getUpdatedAt(),
    };
  }
}
