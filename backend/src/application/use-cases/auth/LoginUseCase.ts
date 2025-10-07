import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { PasswordService } from "@application/services/PasswordService";
import { TokenManagementService } from "@application/services/TokenManagementService";
import { LoginRequestDto } from "../../dto/auth/LoginRequestDto";
import { LoginResponseDto } from "../../dto/auth/LoginResponseDto";
import { Result } from "@shared/utils/Result";
import {
  InvalidCredentialsError,
  AccountStatusError,
  DomainError,
} from "@domain/errors";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { AccountStatusErrorFactory } from "@domain/errors/strategies/AccountStatusErrorFactory";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.PasswordService) private passwordService: PasswordService,
    @inject(TYPES.TokenManagementService)
    private tokenManagementService: TokenManagementService
  ) {}

  async execute(
    dto: LoginRequestDto
  ): Promise<Result<LoginResponseDto, Error>> {
    try {
      Logger.info("Login attempt started", { email: dto.getEmailValue() });

      // Find and validate user
      const userValidationResult = await this.validateUser(dto);
      if (userValidationResult.isFailure()) {
        return userValidationResult;
      }

      const user = userValidationResult.getValue();

      // Generate tokens
      const accessToken = this.tokenManagementService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      const refreshTokenValue =
        this.tokenManagementService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Manage refresh tokens
      await this.tokenManagementService.cleanupUserRefreshTokens(user.getId());

      const refreshToken = this.tokenManagementService.createRefreshTokenEntity(
        user.getId(),
        refreshTokenValue,
        refreshTokenExpiry
      );

      await this.tokenManagementService.saveRefreshToken(refreshToken);

      // Prepare response
      const response: LoginResponseDto = {
        accessToken,
        refreshToken: refreshTokenValue,
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmailValue(),
          role: user.getRole(),
          status: user.getStatus(),
          mobile: user.getMobile(),
          profilePicture: user.getProfilePicture(),
          isVerified: user.getIsVerified(),
        },
        expiresIn: 3600, // 1 hour in seconds
      };

      Logger.info("Login successful", {
        userId: user.getId(),
        email: dto.getEmailValue(),
        role: user.getRole(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Login use case error", {
        email: dto.getEmailValue(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private async validateUser(
    dto: LoginRequestDto
  ): Promise<Result<any, Error>> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.getEmailValue());
    if (!user) {
      Logger.warn("Login failed - user not found", {
        email: dto.getEmailValue(),
      });
      return Result.failure(new InvalidCredentialsError());
    }

    // Check if user account is in valid state for login
    if (!user.canLogin()) {
      const reason = user.getIsVerified()
        ? "Account status invalid"
        : "Account not verified";
      Logger.warn("Login failed - account state invalid", {
        email: dto.getEmailValue(),
        status: user.getStatus(),
        isVerified: user.getIsVerified(),
        reason,
      });
      return Result.failure(
        AccountStatusErrorFactory.createError(user.getStatus())
      );
    }

    // Verify password (skip for Google users)
    if (!user.isGoogleUser()) {
      const isPasswordValid = await this.passwordService.compare(
        dto.getPassword(),
        user.getPasswordHash()
      );
      if (!isPasswordValid) {
        Logger.warn("Login failed - invalid password", {
          email: dto.getEmailValue(),
        });
        return Result.failure(new InvalidCredentialsError());
      }
    }

    return Result.success(user);
  }
}
