import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { PasswordService } from "@application/services/PasswordService";
import { UpdatePasswordDto } from "../../dto/auth/UpdatePasswordDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AuthMessages,
  AuthErrorMessages,
} from "@shared/constants/AuthConstants";
import {
  UserNotFoundError,
  InvalidCredentialsError,
  DomainError,
  PasswordResetError,
} from "@domain/errors";
import { Password } from "@domain/value-objects/Password";

@injectable()
export class UpdatePasswordUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.PasswordService) private passwordService: PasswordService
  ) {}

  async execute(dto: UpdatePasswordDto): Promise<Result<void>> {
    try {
      Logger.info("Update password started", { userId: dto.getUserId() });

      const user = await this.userRepository.findById(dto.getUserId());
      if (!user) {
        Logger.warn("Update password failed - user not found", {
          userId: dto.getUserId(),
        });
        return Result.failure(new UserNotFoundError());
      }

      if (user.isGoogleUser()) {
        Logger.warn("Update password failed - Google user", {
          userId: dto.getUserId(),
        });
        return Result.failure(
          new DomainError("Google users cannot change password")
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await this.passwordService.compare(
        dto.getCurrentPassword(),
        user.getPasswordHash()
      );

      if (!isCurrentPasswordValid) {
        Logger.warn("Update password failed - invalid current password", {
          userId: dto.getUserId(),
        });
        return Result.failure(new InvalidCredentialsError());
      }

      // Check if new password is same as current
      const isSamePassword = await this.passwordService.compare(
        dto.getNewPassword(),
        user.getPasswordHash()
      );

      if (isSamePassword) {
        Logger.warn("Update password failed - same as current password", {
          userId: dto.getUserId(),
        });
        return Result.failure(
          new DomainError(
            "New password must be different from current password"
          )
        );
      }

      // Validate new password strength
      if (
        !this.passwordService.validatePasswordStrength(dto.getNewPassword())
      ) {
        Logger.warn("Update password failed - weak password", {
          userId: dto.getUserId(),
        });
        return Result.failure(
          new PasswordResetError("Password does not meet security requirements")
        );
      }

      // Hash new password and update
      const newPasswordHash = await this.passwordService.hash(
        dto.getNewPassword()
      );
      const passwordVO = Password.createFromHash(newPasswordHash);
      user.updatePassword(passwordVO);
      await this.userRepository.save(user);

      Logger.info("Update password completed successfully", {
        userId: dto.getUserId(),
      });

      return Result.success();
    } catch (error) {
      Logger.error("Update password use case error", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
