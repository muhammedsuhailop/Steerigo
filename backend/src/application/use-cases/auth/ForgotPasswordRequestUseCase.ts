import { injectable, inject } from "inversify";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { IPasswordService } from "@application/services/IPasswordService";
import { IEmailService } from "@application/services/IEmailService";
import { IOtpService } from "@application/services/IOtpService";
import { ForgotPasswordRequestDto } from "../../dto/auth/ForgotPasswordRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AuthMessages,
  AuthErrorMessages,
} from "@shared/constants/AuthConstants";
import { AppConstants } from "@shared/constants/AppConstants";
import { UserNotFoundError, DomainError } from "@domain/errors";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class ForgotPasswordRequestUseCase
  implements IUseCase<ForgotPasswordRequestDto, Promise<Result<void>>>
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PasswordService) private passwordService: IPasswordService,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.OtpService) private otpService: IOtpService
  ) {}

  async execute(dto: ForgotPasswordRequestDto): Promise<Result<void>> {
    try {
      Logger.info("Forgot password request started", { email: dto.getEmail() });

      const user = await this.userRepository.findByEmail(dto.getEmail());
      if (!user) {
        Logger.warn("Forgot password failed - user not found", {
          email: dto.getEmail(),
        });
        return Result.failure(new UserNotFoundError());
      }

      if (!user.getIsVerified()) {
        Logger.warn("Forgot password failed - user not verified", {
          email: dto.getEmail(),
        });
        return Result.failure(
          new DomainError(AuthErrorMessages.EMAIL_NOT_VERIFIED)
        );
      }

      if (user.isGoogleUser()) {
        Logger.warn("Forgot password failed - Google user", {
          email: dto.getEmail(),
        });
        return Result.failure(
          new DomainError(
            "Google users cannot reset password. Please sign in with Google."
          )
        );
      }

      // Generate and set reset OTP
      const otp = this.otpService.generate();
      const otpHash = await this.otpService.hash(otp);
      const otpExpires = new Date(
        Date.now() + AppConstants.OTP_TTL_SECONDS * 1000
      );

      user.setResetOtpDetails(otpHash, otpExpires);
      await this.userRepository.save(user);

      // Send reset OTP email
      await this.emailService.sendPasswordResetOtp(
        dto.getEmail(),
        otp,
        user.getName()
      );

      Logger.info("Forgot password request completed successfully", {
        email: dto.getEmail(),
        userId: user.getId(),
      });

      return Result.success();
    } catch (error) {
      Logger.error("Forgot password request use case error", {
        email: dto.getEmail(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
