import { injectable, inject } from "inversify";
import { ITokenManagementService } from "@application/services/ITokenManagementService";
import { ITokenService } from "@application/services/ITokenService";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { v4 as uuid } from "uuid";
import { TYPES } from "@shared/constants/DITypes";
import { UserRole } from "@shared/constants/AuthConstants";

@injectable()
export class TokenManagementService implements ITokenManagementService {
  constructor(
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  generateAccessToken(payload: { userId: string; role: UserRole }): string {
    return this.tokenService.generateAccessToken(payload);
  }

  generateRefreshToken(): string {
    return this.tokenService.generateRefreshToken();
  }

  createRefreshTokenEntity(
    userId: string,
    token: string,
    expiresAt: Date
  ): RefreshToken {
    return RefreshToken.create({
      id: uuid(),
      userId,
      token,
      expiresAt,
    });
  }

  async cleanupUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }

  async saveRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokenRepository.save(refreshToken);
  }
}
