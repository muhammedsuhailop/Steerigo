import { injectable, inject } from "inversify";
import { IRefreshTokenRepository } from "@application/repositories/IRefreshTokenRepository";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { ITokenService } from "@application/services/ITokenService";
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
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class RefreshTokenUseCase
  implements
    IUseCase<
      RefreshTokenDto,
      Promise<Result<{ accessToken: string; refreshToken: string }, Error>>
    >
{
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.TokenService)
    private tokenService: ITokenService
  ) {}

  async execute(
    dto: RefreshTokenDto
  ): Promise<Result<{ accessToken: string; refreshToken: string }, Error>> {
    try {
      const oldToken = await this.refreshTokenRepository.findByToken(
        dto.refreshToken
      );
      if (!oldToken) {
        return Result.failure<
          { accessToken: string; refreshToken: string },
          Error
        >(new DomainError("Invalid refresh token"));
      }
      if (!oldToken.isValid()) {
        if (oldToken.isExpired()) {
          return Result.failure<
            { accessToken: string; refreshToken: string },
            Error
          >(new RefreshTokenExpiredError());
        } else {
          return Result.failure<
            { accessToken: string; refreshToken: string },
            Error
          >(new RefreshTokenRevokedError());
        }
      }
      const user = await this.userRepository.findById(oldToken.getUserId());
      if (!user || !user.getIsVerified()) {
        return Result.failure<
          { accessToken: string; refreshToken: string },
          Error
        >(new DomainError("User not found or not verified"));
      }

      const accessToken = this.tokenService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      oldToken.revoke();
      await this.refreshTokenRepository.save(oldToken);

      const newTokenValue = this.tokenService.generateRefreshToken();
      const newTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const newToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: newTokenValue,
        expiresAt: newTokenExpiry,
      });
      await this.refreshTokenRepository.save(newToken);

      return Result.success<
        { accessToken: string; refreshToken: string },
        Error
      >({
        accessToken,
        refreshToken: newTokenValue,
      });
    } catch (error) {
      return Result.failure<
        { accessToken: string; refreshToken: string },
        Error
      >(error as Error);
    }
  }
}
