import { injectable } from "inversify";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "@domain/entities/RefreshToken";
import {
  RefreshTokenModel,
  IRefreshTokenDocument,
} from "../models/RefreshTokenModel";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
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
