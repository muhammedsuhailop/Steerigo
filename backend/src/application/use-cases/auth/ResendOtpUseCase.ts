import { injectable, inject } from 'inversify';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IEmailService } from '@domain/services/IEmailService';
import { IOtpService } from '@domain/services/IOtpService';
import { DomainError } from '@domain/errors';
import { ResendOtpDto } from '../../dto/auth/ResendOtpDto';
import { Result } from '@shared/utils/Result';

@injectable()
export class ResendOtpUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IEmailService') private emailService: IEmailService,
        @inject('IOtpService') private otpService: IOtpService
    ) { }

    async execute(dto: ResendOtpDto): Promise<Result<void>> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                return Result.failure(new DomainError('No signup request found for this email'));
            }

            // Check if user can receive a new OTP (basic rate limiting at domain level)
            const lastOtpTime = user.getUpdatedAt();
            const now = new Date();
            const timeDiffMinutes = (now.getTime() - lastOtpTime.getTime()) / (1000 * 60);

            if (timeDiffMinutes < 1) {
                return Result.failure(new DomainError('Please wait at least 1 minute before requesting a new OTP'));
            }

            // Generate new OTP
            const otp = this.otpService.generate();
            const otpHash = await this.otpService.hash(otp);
            const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_TTL_SECONDS || '90') * 1000));

            // Update user with new OTP details
            user.setOtpDetails(otpHash, otpExpires);
            await this.userRepository.save(user);

            // Send new OTP email
            await this.emailService.sendResendOtp(dto.email, otp);

            return Result.success();
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}
