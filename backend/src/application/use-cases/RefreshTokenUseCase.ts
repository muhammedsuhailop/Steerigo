import { injectable, inject } from 'inversify';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITokenService } from '@domain/services/ITokenService';
import { RefreshTokenExpiredError, RefreshTokenRevokedError, DomainError } from '@domain/errors';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { RefreshTokenDto } from '../dto/RefreshTokenDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class RefreshTokenUseCase {
    constructor(
        @inject('IRefreshTokenRepository') private refreshTokenRepository: IRefreshTokenRepository,
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('ITokenService') private tokenService: ITokenService
    ) { }

    async execute(dto: RefreshTokenDto): Promise<Result<{ accessToken: string; refreshToken: string }>> {
        try {
            // Find refresh token
            const refreshToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);

            if (!refreshToken) {
                return Result.failure(new DomainError('Invalid refresh token'));
            }

            // Check if token is valid
            if (!refreshToken.isValid()) {
                if (refreshToken.isExpired()) {
                    return Result.failure(new RefreshTokenExpiredError());
                } else {
                    return Result.failure(new RefreshTokenRevokedError());
                }
            }

            // Get user
            const user = await this.userRepository.findById(refreshToken.getUserId());
            if (!user || !user.getIsVerified()) {
                return Result.failure(new DomainError('User not found or not verified'));
            }

            // Generate new access token
            const accessToken = this.tokenService.generate({
                userId: user.getId(),
                role: user.getRole()
            });

            // Generate new refresh token and revoke old one
            const newRefreshTokenValue = this.tokenService.generateRefreshToken();
            const newRefreshTokenExpiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days

            // Revoke old token
            refreshToken.revoke();
            await this.refreshTokenRepository.save(refreshToken);

            // Create new refresh token
            const { v4: uuid } = require('uuid');
            const newRefreshToken = RefreshToken.create({
                id: uuid(),
                userId: user.getId(),
                token: newRefreshTokenValue,
                expiresAt: newRefreshTokenExpiry
            });

            await this.refreshTokenRepository.save(newRefreshToken);

            return Result.success({
                accessToken,
                refreshToken: newRefreshTokenValue
            });
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}
