import { injectable, inject } from "inversify";
import { UserRepository } from "@domain/repositories/UserRepository";
import { PasswordService } from "@application/services/PasswordService";
import { TokenService } from "@application/services/TokenService";
import { RefreshTokenRepository } from "@domain/repositories/RefreshTokenRepository";
import { LoginRequestDto } from "../../dto/auth/LoginRequestDto";
import { LoginResponseDto } from "../../dto/auth/LoginResponseDto";
import { Result } from "@shared/utils/Result";
import {
  InvalidCredentialsError,
  AccountStatusError,
  DomainError,
} from "@domain/errors";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { Logger } from "@shared/utils/Logger";
import { v4 as uuid } from "uuid";
import { TYPES } from "@shared/constants/DITypes"; 

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.PasswordService) private passwordService: PasswordService,
    @inject(TYPES.TokenService) private tokenService: TokenService,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(
    dto: LoginRequestDto
  ): Promise<Result<LoginResponseDto, Error>> {
    try {
      Logger.info("Login attempt started", { email: dto.getEmailValue() });

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
        return Result.failure(new AccountStatusError(user.getStatus()));
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

      // Generate access token
      const accessToken = this.tokenService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      // Generate refresh token
      const refreshTokenValue = this.tokenService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Clean up existing refresh tokens for this user
      await this.refreshTokenRepository.deleteByUserId(user.getId());

      // Create and save new refresh token
      const refreshToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: refreshTokenValue,
        expiresAt: refreshTokenExpiry,
      });

      await this.refreshTokenRepository.save(refreshToken);

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
}
