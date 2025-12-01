// src/application/use-cases/auth/LogoutUseCase.ts

import { injectable, inject } from "inversify";
import { RefreshTokenRepository } from "@application/repositories/RefreshTokenRepository";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Logger } from "@shared/utils/Logger";

/**
 * Logout Use Case
 *
 * Handles user logout by revoking the refresh token.
 * Implements IUseCase interface with RefreshTokenDto input and void output.
 *
 * @implements IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>
 */
@injectable()
export class LogoutUseCase
  implements IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>
{
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(dto: RefreshTokenDto): Promise<Result<void, Error>> {
    try {
      Logger.info("Logout attempt started");

      const refreshToken = await this.refreshTokenRepository.findByToken(
        dto.refreshToken
      );

      if (refreshToken && refreshToken.isValid()) {
        refreshToken.revoke();
        await this.refreshTokenRepository.save(refreshToken);
        Logger.info("Refresh token revoked successfully");
      }

      return Result.success<void, Error>();
    } catch (error) {
      Logger.error("Logout use case error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure<void, Error>(error as Error);
    }
  }
}
