import { injectable, inject } from "inversify";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { IRefreshTokenRepository } from "@application/repositories/IRefreshTokenRepository";
import { OtpService } from "@application/services/OtpService";
import { TokenService } from "@application/services/TokenService";
import { EmailService } from "@application/services/EmailService";
import {
  OtpExpiredError,
  MaxOtpAttemptsError,
  OtpNotFoundError,
  DomainError,
} from "@domain/errors";
import { SignupVerifyDto } from "../../dto/auth/SignupVerifyDto";
import { SignupVerifyResponseDto } from "../../dto/auth/SignupVerifyResponseDto";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  AuthMessages,
  AuthErrorMessages,
} from "@shared/constants/AuthConstants";
import { v4 as uuid } from "uuid";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class SignupVerifyUseCase
  implements IUseCase<SignupVerifyDto, Promise<Result<SignupVerifyResponseDto>>>
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository,
    @inject(TYPES.OtpService) private otpService: OtpService,
    @inject(TYPES.TokenService) private tokenService: TokenService,
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  async execute(
    dto: SignupVerifyDto
  ): Promise<Result<SignupVerifyResponseDto>> {
    try {
      Logger.info("Signup verification started", { email: dto.getEmail() });

      const user = await this.userRepository.findByEmail(dto.getEmail());
      if (!user) {
        Logger.warn("Signup verify failed - user not found", {
          email: dto.getEmail(),
        });
        return Result.failure(
          new DomainError("No signup request found for this email")
        );
      }

      if (user.getIsVerified()) {
        Logger.warn("Signup verify failed - already verified", {
          email: dto.getEmail(),
        });
        return Result.failure(new DomainError("User is already verified"));
      }

      if (user.isOtpExpired()) {
        Logger.warn("Signup verify failed - OTP expired", {
          email: dto.getEmail(),
        });
        return Result.failure(new OtpExpiredError());
      }

      if (!user.canAttemptOtpVerification()) {
        Logger.warn("Signup verify failed - max attempts exceeded", {
          email: dto.getEmail(),
        });
        return Result.failure(new MaxOtpAttemptsError());
      }

      // Verify OTP
      const otpHash = user.getOtpHash();
      if (!otpHash) {
        Logger.warn("Signup verify failed - no OTP hash", {
          email: dto.getEmail(),
        });
        return Result.failure(new OtpNotFoundError());
      }

      const isOtpValid = await this.otpService.verify(dto.getOtp(), otpHash);
      if (!isOtpValid) {
        user.incrementOtpAttempts();
        await this.userRepository.save(user);
        Logger.warn("Signup verify failed - invalid OTP", {
          email: dto.getEmail(),
          attempts: user.getOtpAttempts(),
        });
        return Result.failure(new DomainError(AuthErrorMessages.OTP_INVALID));
      }

      // Verify user
      user.markEmailAsVerified();
      await this.userRepository.save(user);

      // Generate tokens
      const accessToken = this.tokenService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      const refreshTokenValue = this.tokenService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Clean up existing refresh tokens
      await this.refreshTokenRepository.deleteByUserId(user.getId());

      // Create new refresh token
      const refreshToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: refreshTokenValue,
        expiresAt: refreshTokenExpiry,
      });

      await this.refreshTokenRepository.save(refreshToken);

      // Send welcome email
      await this.emailService.sendWelcomeEmail(
        user.getEmailValue(),
        user.getName()
      );

      const response: SignupVerifyResponseDto = {
        accessToken,
        refreshToken: refreshTokenValue,
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmailValue(),
          mobile: user.getMobile() ?? "",
          role: user.getRole(),
          status: user.getStatus(),
          profilePicture: user.getProfilePicture(),
          isVerified: user.getIsVerified(),
        },
        expiresIn: 3600, // 1 hour in seconds
      };

      Logger.info("Signup verification completed successfully", {
        userId: user.getId(),
        email: dto.getEmail(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Signup verify use case error", {
        email: dto.getEmail(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
