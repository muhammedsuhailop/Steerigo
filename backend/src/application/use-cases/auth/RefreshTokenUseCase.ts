import { injectable, inject } from "inversify";
import { RefreshTokenRepository } from "@domain/repositories/RefreshTokenRepository";
import { UserRepository } from "@domain/repositories/UserRepository";
import { TokenService } from "@application/services/TokenService";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { Result } from "@shared/utils/Result";
import {
  DomainError,
  RefreshTokenExpiredError,
  RefreshTokenRevokedError,
} from "@domain/errors";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { v4 as uuid } from "uuid";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository,
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository,
    @inject(TYPES.TokenService)
    private tokenService: TokenService
  ) {}

  async execute(
    dto: RefreshTokenDto
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    try {
      const oldToken = await this.refreshTokenRepository.findByToken(
        dto.refreshToken
      );
      if (!oldToken) {
        return Result.failure(new DomainError("Invalid refresh token"));
      }
      if (!oldToken.isValid()) {
        if (oldToken.isExpired()) {
          return Result.failure(new RefreshTokenExpiredError());
        } else {
          return Result.failure(new RefreshTokenRevokedError());
        }
      }
      const user = await this.userRepository.findById(oldToken.getUserId());
      if (!user || !user.getIsVerified()) {
        return Result.failure(
          new DomainError("User not found or not verified")
        );
      }

      const accessToken = this.tokenService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      // Revoke old and save
      oldToken.revoke();
      await this.refreshTokenRepository.save(oldToken);

      // Create new
      const newTokenValue = this.tokenService.generateRefreshToken();
      const newTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const newToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: newTokenValue,
        expiresAt: newTokenExpiry,
      });
      await this.refreshTokenRepository.save(newToken);

      return Result.success({
        accessToken,
        refreshToken: newTokenValue,
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
