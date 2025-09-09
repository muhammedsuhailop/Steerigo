import { injectable, inject } from 'inversify';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@domain/services/IPasswordService';
import { IEmailService } from '@domain/services/IEmailService';
import { IOtpService } from '@domain/services/IOtpService';
import { User } from '@domain/entities/User';
import { UserAlreadyExistsError } from '@domain/errors';
import { SignupRequestDto } from '../../dto/auth/SignupRequestDto';
import { Result } from '@shared/utils/Result';
import { v4 as uuid } from 'uuid';

@injectable()
export class SignupRequestUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IPasswordService') private passwordService: IPasswordService,
        @inject('IEmailService') private emailService: IEmailService,
        @inject('IOtpService') private otpService: IOtpService
    ) { }

    async execute(dto: SignupRequestDto): Promise<Result<void>> {
        try {
            // Check if verified user exists
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser && existingUser.getIsVerified()) {
                return Result.failure(new UserAlreadyExistsError());
            }

            // Hash password
            const passwordHash = await this.passwordService.hash(dto.password);

            // Create or update user
            const user = User.create({
                id: uuid(),
                name: dto.name,
                email: dto.email,
                password: passwordHash,
                mobile: dto.mobile,
                role: dto.role
            });

            // Generate and set OTP
            const otp = this.otpService.generate();
            const otpHash = await this.otpService.hash(otp);
            const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_TTL_SECONDS || '300') * 1000));

            user.setOtpDetails(otpHash, otpExpires);

            // Save user
            await this.userRepository.save(user);

            // Send OTP email
            await this.emailService.sendOtp(dto.email, otp);

            return Result.success();
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}
