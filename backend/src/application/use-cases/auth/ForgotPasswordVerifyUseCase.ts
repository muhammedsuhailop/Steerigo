import { injectable, inject } from "inversify";
import { UserRepository } from "@domain/repositories/UserRepository";
import { PasswordService } from "@application/services/PasswordService";
import { EmailService } from "@application/services/EmailService";
import { OtpService } from "@application/services/OtpService";
import { ForgotPasswordVerifyDto } from "../../dto/auth/ForgotPasswordVerifyDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AuthMessages,
  AuthErrorMessages,
} from "@shared/constants/AuthConstants";
import {
  UserNotFoundError,
  OtpExpiredError,
  MaxOtpAttemptsError,
  DomainError,
  PasswordResetError,
} from "@domain/errors";
import { Password } from "@domain/value-objects/Password";

@injectable()
export class ForgotPasswordVerifyUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.PasswordService) private passwordService: PasswordService,
    @inject(TYPES.EmailService) private emailService: EmailService,
    @inject(TYPES.OtpService) private otpService: OtpService
  ) {}

  async execute(dto: ForgotPasswordVerifyDto): Promise<Result<void>> {
    try {
      Logger.info("Forgot password verify started", { email: dto.getEmail() });

      const user = await this.userRepository.findByEmail(dto.getEmail());
      if (!user) {
        Logger.warn("Forgot password verify failed - user not found", {
          email: dto.getEmail(),
        });
        return Result.failure(new UserNotFoundError());
      }

      if (user.isResetOtpExpired()) {
        Logger.warn("Forgot password verify failed - OTP expired", {
          email: dto.getEmail(),
        });
        return Result.failure(new OtpExpiredError());
      }

      if (!user.canAttemptResetOtp()) {
        Logger.warn("Forgot password verify failed - max attempts exceeded", {
          email: dto.getEmail(),
        });
        return Result.failure(new MaxOtpAttemptsError());
      }

      // Verify OTP
      const resetOtpHash = user.getResetOtpHash();
      if (!resetOtpHash) {
        Logger.warn("Forgot password verify failed - no reset OTP hash", {
          email: dto.getEmail(),
        });
        return Result.failure(new DomainError(AuthErrorMessages.OTP_NOT_FOUND));
      }

      const isOtpValid = await this.otpService.verify(
        dto.getOtp(),
        resetOtpHash
      );
      if (!isOtpValid) {
        user.incrementResetOtpAttempts();
        await this.userRepository.save(user);
        Logger.warn("Forgot password verify failed - invalid OTP", {
          email: dto.getEmail(),
          attempts: user.getOtpAttempts(),
        });
        return Result.failure(new DomainError(AuthErrorMessages.OTP_INVALID));
      }

      // Validate password strength
      if (
        !this.passwordService.validatePasswordStrength(dto.getNewPassword())
      ) {
        return Result.failure(
          new PasswordResetError("Password does not meet security requirements")
        );
      }

      // Hash new password and update user
      const newPasswordHash = await this.passwordService.hash(
        dto.getNewPassword()
      );
      const passwordVO = Password.createFromHash(newPasswordHash);
      user.updatePassword(passwordVO);
      await this.userRepository.save(user);

      // Send confirmation email
      await this.emailService.sendPasswordResetConfirmation(
        dto.getEmail(),
        user.getName()
      );

      Logger.info("Forgot password verify completed successfully", {
        email: dto.getEmail(),
        userId: user.getId(),
      });

      return Result.success();
    } catch (error) {
      Logger.error("Forgot password verify use case error", {
        email: dto.getEmail(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
