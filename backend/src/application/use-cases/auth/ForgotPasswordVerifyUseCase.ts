import { injectable, inject } from 'inversify';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { IOtpService } from '@domain/services/IOtpService';
import { IPasswordService } from '@domain/services/IPasswordService';
import { OtpExpiredError, MaxOtpAttemptsError, DomainError } from '@domain/errors';
import { ForgotPasswordVerifyDto } from '../../dto/auth/ForgotPasswordVerifyDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class ForgotPasswordVerifyUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IRefreshTokenRepository') private refreshTokenRepository: IRefreshTokenRepository,
        @inject('IOtpService') private otpService: IOtpService,
        @inject('IPasswordService') private passwordService: IPasswordService
    ) { }

    async execute(dto: ForgotPasswordVerifyDto): Promise<Result<void>> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                return Result.failure(new DomainError('Invalid request'));
            }

            if (!user.getIsVerified()) {
                return Result.failure(new DomainError('Account is not verified'));
            }

            if (user.isOtpExpired()) {
                return Result.failure(new OtpExpiredError());
            }

            if (!user.canAttemptOtpVerification()) {
                return Result.failure(new MaxOtpAttemptsError());
            }

            const otpHash = user.getOtpHash();
            if (!otpHash) {
                return Result.failure(new DomainError('No password reset request found. Please request a new one'));
            }

            const isOtpValid = await this.otpService.verify(dto.otp, otpHash);

            if (!isOtpValid) {
                user.incrementOtpAttempts();
                await this.userRepository.save(user);
                return Result.failure(new DomainError('Invalid OTP'));
            }

            const isSamePassword = await this.passwordService.compare(
                dto.newPassword,
                user.getPassword()
            );

            if (isSamePassword) {
                return Result.failure(new DomainError('New password must be different from current password'));
            }

            const newPasswordHash = await this.passwordService.hash(dto.newPassword);

            user.resetPassword(newPasswordHash);
            await this.userRepository.save(user);

            await this.refreshTokenRepository.deleteByUserId(user.getId());

            return Result.success();
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}