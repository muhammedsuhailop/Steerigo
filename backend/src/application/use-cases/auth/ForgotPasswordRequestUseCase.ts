import { injectable, inject } from 'inversify';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IEmailService } from '@domain/services/IEmailService';
import { IOtpService } from '@domain/services/IOtpService';
import { DomainError } from '@domain/errors';
import { ForgotPasswordRequestDto } from '../../dto/auth/ForgotPasswordRequestDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class ForgotPasswordRequestUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IEmailService') private emailService: IEmailService,
        @inject('IOtpService') private otpService: IOtpService
    ) { }

    async execute(dto: ForgotPasswordRequestDto): Promise<Result<void>> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                return Result.failure(new DomainError('No account registered with this email address'));
            }

            if (!user.getIsVerified()) {
                return Result.failure(new DomainError('Account is not verified. Please complete signup verification first'));
            }

            const lastOtpTime = user.getUpdatedAt();
            const now = new Date();
            const timeDiffMinutes = (now.getTime() - lastOtpTime.getTime()) / (1000 * 60);

            if (timeDiffMinutes < 1) {
                return Result.failure(new DomainError('Please wait at least 1 minute before requesting password reset again'));
            }

            // Generate OTP for password reset
            const otp = this.otpService.generate();
            const otpHash = await this.otpService.hash(otp);
            const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_TTL_SECONDS || '300') * 1000));

            // Set password reset OTP (reusing existing OTP functionality)
            user.setPasswordResetOtp(otpHash, otpExpires);
            await this.userRepository.save(user);

            // Send password reset OTP email
            await this.emailService.sendPasswordResetOtp(dto.email, otp, user.getName());

            return Result.success();
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}