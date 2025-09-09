import { injectable, inject } from "inversify";
import { IGoogleAuthService } from "@domain/services/IGoogleAuthService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ITokenService } from "@domain/services/ITokenService";
import { User } from "@domain/entities/User";
import { GoogleLoginDto } from "../../dto/auth/GoogleLoginDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { v4 as uuid } from "uuid";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";

@injectable()
export class GoogleLoginUseCase {
  constructor(
    @inject("IGoogleAuthService") private googleAuthService: IGoogleAuthService,
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IRefreshTokenRepository")
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(dto: GoogleLoginDto): Promise<
    Result<{
      accessToken: string;
      refreshToken: string;
      user: any;
      isNewUser: boolean;
    }>
  > {
    try {
      const tokens = await this.googleAuthService.exchangeCodeForTokens(
        dto.code
      );

      const googleProfile = await this.googleAuthService.getUserProfile(
        tokens.access_token
      );

      if (!googleProfile.verified_email) {
        return Result.failure(new Error("Google email not verified"));
      }

      let user = await this.userRepository.findByGoogleId(googleProfile.id);
      let isNewUser = false;

      if (!user) {
        const existingEmailUser = await this.userRepository.findByEmail(
          googleProfile.email
        );

        if (existingEmailUser && !existingEmailUser.isGoogleUser()) {
          return Result.failure(
            new Error(
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

        Logger.info("New Google user created", {
          email: user.getEmail(),
          googleId: googleProfile.id,
        });
      } else {
        if (
          googleProfile.picture &&
          googleProfile.picture !== user.getProfilePicture()
        ) {
          await this.userRepository.save(user);
        }

        Logger.info("Existing Google user logged in", {
          email: user.getEmail(),
        });
      }

      const accessToken = this.tokenService.generate({
        userId: user.getId(),
        role: user.getRole(),
      });

      const refreshTokenValue = this.tokenService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await this.refreshTokenRepository.deleteByUserId(user.getId());

      const refreshToken = RefreshToken.create({
        id: uuid(),
        userId: user.getId(),
        token: refreshTokenValue,
        expiresAt: refreshTokenExpiry,
      });
      await this.refreshTokenRepository.save(refreshToken);

      return Result.success({
        accessToken,
        refreshToken: refreshTokenValue,
        // user: {
        //   id: user.getId(),
        //   name: user.getName(),
        //   email: user.getEmail(),
        //   role: user.getRole(),
        //   status: user.getStatus(),
        //   profilePicture: user.getProfilePicture(),
        //   authProvider: user.getAuthProvider(),
        // },
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole(),
          status: user.getStatus(),
        },
        isNewUser,
      });
    } catch (error) {
      Logger.error("Google login failed", error);
      return Result.failure(error as Error);
    }
  }
}
