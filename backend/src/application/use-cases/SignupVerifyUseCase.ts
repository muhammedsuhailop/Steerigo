import { injectable, inject } from 'inversify';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IOtpService } from '@domain/services/IOtpService';
import { ITokenService } from '@domain/services/ITokenService';
import { IEmailService } from '@domain/services/IEmailService';
import { OtpExpiredError, MaxOtpAttemptsError, DomainError } from '@domain/errors';
import { SignupVerifyDto } from '../dto/SignupVerifyDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class SignupVerifyUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IOtpService') private otpService: IOtpService,
        @inject('ITokenService') private tokenService: ITokenService,
        @inject('IEmailService') private emailService: IEmailService
    ) { }

    async execute(dto: SignupVerifyDto): Promise<Result<{ token: string; user: any }>> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                return Result.failure(new DomainError('No signup request found for this email'));
            }

            if (user.getIsVerified()) {
                return Result.failure(new DomainError('User is already verified'));
            }

            if (user.isOtpExpired()) {
                return Result.failure(new OtpExpiredError());
            }

            if (!user.canAttemptOtpVerification()) {
                return Result.failure(new MaxOtpAttemptsError());
            }

            // Verify OTP
            const otpHash = user.getOtpHash();
            if (!otpHash) {
                return Result.failure(new DomainError('No OTP found. Please request a new one'));
            }

            const isOtpValid = await this.otpService.verify(dto.otp, otpHash);

            if (!isOtpValid) {
                user.incrementOtpAttempts();
                await this.userRepository.save(user);
                return Result.failure(new DomainError('Invalid OTP'));
            }

            // Verify user
            user.verify();
            await this.userRepository.save(user);

            // Generate JWT token
            const token = this.tokenService.generate({
                userId: user.getId(),
                role: user.getRole()
            });

            return Result.success({
                token,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    mobile: user.getMobile(),
                    role: user.getRole(),
                    status: user.getStatus()
                }
            });
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}
