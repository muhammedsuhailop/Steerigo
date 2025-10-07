import { RefreshToken } from "@domain/entities/RefreshToken";

export interface TokenManagementService {
  generateAccessToken(payload: { userId: string; role: string }): string;
  generateRefreshToken(): string;
  createRefreshTokenEntity(
    userId: string,
    token: string,
    expiresAt: Date
  ): RefreshToken;
  cleanupUserRefreshTokens(userId: string): Promise<void>;
  saveRefreshToken(refreshToken: RefreshToken): Promise<void>;
}
