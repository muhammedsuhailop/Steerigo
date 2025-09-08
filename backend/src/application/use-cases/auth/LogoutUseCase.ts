import { injectable, inject } from 'inversify';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { RefreshTokenDto } from '../../dto/auth/RefreshTokenDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class LogoutUseCase {
    constructor(
        @inject('IRefreshTokenRepository') private refreshTokenRepository: IRefreshTokenRepository
    ) { }

    async execute(dto: RefreshTokenDto): Promise<Result<void>> {
        try {
            // Find and revoke refresh token
            const refreshToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);

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
