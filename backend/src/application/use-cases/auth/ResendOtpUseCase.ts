import { injectable, inject } from "inversify";
import { UserRepository } from "@domain/repositories/UserRepository";
import { OtpService } from "@application/services/OtpService";
import { EmailService } from "@application/services/EmailService";
import { ResendOtpDto } from "../../dto/auth/ResendOtpDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AuthMessages,
  AuthErrorMessages,
} from "@shared/constants/AuthConstants";
import { AppConstants } from "@shared/constants/AppConstants";
import { UserNotFoundError, DomainError } from "@domain/errors";

@injectable()
export class ResendOtpUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.OtpService) private otpService: OtpService,
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  async execute(dto: ResendOtpDto): Promise<Result<{ expiresAt: Date }>> {
    try {
      Logger.info("Resend OTP started", { email: dto.getEmail() });

      const user = await this.userRepository.findByEmail(dto.getEmail());
      if (!user) {
        Logger.warn("Resend OTP failed - user not found", {
          email: dto.getEmail(),
        });
        return Result.failure(new UserNotFoundError());
      }

      // Generate and set new OTP
      const otp = this.otpService.generate();
      const otpHash = await this.otpService.hash(otp);
      const otpExpires = new Date(
        Date.now() + AppConstants.OTP_TTL_SECONDS * 1000
      );

      Logger.info("OTP Generated:", otp); //for dev

      user.setOtpDetails(otpHash, otpExpires);
      await this.userRepository.save(user);

      // Send new OTP email
      await this.emailService.sendVerificationOtp(
        dto.getEmail(),
        otp,
        user.getName()
      );

      Logger.info("Resend OTP completed successfully", {
        email: dto.getEmail(),
        userId: user.getId(),
      });

      return Result.success({ expiresAt: otpExpires });
    } catch (error) {
      Logger.error("Resend OTP use case error", {
        email: dto.getEmail(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
