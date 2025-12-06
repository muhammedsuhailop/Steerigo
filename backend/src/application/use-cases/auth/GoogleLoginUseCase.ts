import { injectable, inject } from "inversify";
import { IGoogleAuthService } from "@application/services/IGoogleAuthService";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { ITokenService } from "@application/services/ITokenService";
import { IRefreshTokenRepository } from "@application/repositories/IRefreshTokenRepository";
import { IEmailService } from "@application/services/IEmailService";
import { User } from "@domain/entities/User";
import { GoogleLoginRequestDto } from "../../dto/auth/GoogleLoginRequestDto";
import { SignupVerifyResponseDto } from "../../dto/auth/SignupVerifyResponseDto";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DomainError, EmailNotVerifiedError } from "@domain/errors";
import { v4 as uuid } from "uuid";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GoogleLoginUseCase
  implements
    IUseCase<
      GoogleLoginRequestDto,
      Promise<Result<SignupVerifyResponseDto & { isNewUser: boolean }>>
    >
{
  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: IGoogleAuthService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository,
    @inject(TYPES.EmailService) private emailService: IEmailService
  ) {}

  async execute(
    dto: GoogleLoginRequestDto
  ): Promise<Result<SignupVerifyResponseDto & { isNewUser: boolean }>> {
    try {
      Logger.info("Google login attempt started");
      Logger.debug("dto.getCode", dto.getCode());
      const tokens = await this.googleAuthService.exchangeCodeForTokens(
        dto.getCode()
      );
      const googleProfile = await this.googleAuthService.getUserProfile(
        tokens.access_token
      );

      if (!googleProfile.verified_email) {
        Logger.warn("Google login failed - email not verified", {
          email: googleProfile.email,
        });
        return Result.failure(new EmailNotVerifiedError());
      }

      let user = await this.userRepository.findByGoogleId(googleProfile.id);
      let isNewUser = false;

      if (!user) {
        const existingEmailUser = await this.userRepository.findByEmail(
          googleProfile.email
        );
        if (existingEmailUser && !existingEmailUser.isGoogleUser()) {
          Logger.warn("Google login failed - email already registered", {
            email: googleProfile.email,
          });
          return Result.failure(
            new DomainError(
              "Email already registered. Please use email/password login."
            )
          );
        }

        user = User.createFromGoogle({
          id: uuid(),
          googleId: googleProfile.id,
          name: googleProfile.name,
          email: googleProfile.email,
          profilePicture: googleProfile.picture,
        });

        await this.userRepository.save(user);
        isNewUser = true;

        // Send welcome email for new users
        await this.emailService.sendWelcomeEmail(
          user.getEmailValue(),
          user.getName()
        );

        Logger.info("New Google user created", {
          email: user.getEmailValue(),
          googleId: googleProfile.id,
        });
      } else {
        // Update profile picture if changed
        if (
          googleProfile.picture &&
          googleProfile.picture !== user.getProfilePicture()
        ) {
          user.updateProfilePicture(googleProfile.picture);
          await this.userRepository.save(user);
        }
        Logger.info("Existing Google user logged in", {
          email: user.getEmailValue(),
        });
      }

      const accessToken = this.tokenService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      const refreshTokenValue = this.tokenService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await this.refreshTokenRepository.deleteByUserId(user.getId());

      const refreshToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: refreshTokenValue,
        expiresAt: refreshTokenExpiry,
      });

      await this.refreshTokenRepository.save(refreshToken);

      const response = {
        accessToken,
        refreshToken: refreshTokenValue,
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmailValue(),
          role: user.getRole(),
          status: user.getStatus(),
          mobile: user.getMobile() ?? "",
          profilePicture: user.getProfilePicture(),
          isVerified: user.getIsVerified(),
        },
        expiresIn: 3600,
        isNewUser,
      };

      Logger.info("Google login successful", {
        userId: user.getId(),
        email: user.getEmailValue(),
        isNewUser,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Google login use case error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
