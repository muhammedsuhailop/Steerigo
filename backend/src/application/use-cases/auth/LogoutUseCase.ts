import { injectable, inject } from "inversify";
import { RefreshTokenRepository } from "@application/repositories/RefreshTokenRepository";
import { RefreshTokenDto } from "@application/dto/auth/RefreshTokenDto";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(dto: RefreshTokenDto): Promise<Result<void>> {
    try {
      const refreshToken = await this.refreshTokenRepository.findByToken(
        dto.refreshToken
      );
      if (refreshToken && refreshToken.isValid()) {
        refreshToken.revoke();
        await this.refreshTokenRepository.save(refreshToken);
      }
      return Result.success();
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
