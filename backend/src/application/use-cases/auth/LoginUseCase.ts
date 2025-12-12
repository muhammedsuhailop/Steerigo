import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { LoginRequestDto } from "../../dto/auth/LoginRequestDto";
import { LoginResponseDto } from "../../dto/auth/LoginResponseDto";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@application/services/IPasswordService";
import { ITokenManagementService } from "@application/services/ITokenManagementService";
import { InvalidCredentialsError } from "@domain/errors";
import { Logger } from "@shared/utils/Logger";
import { AccountStatusErrorFactory } from "@domain/errors/strategies/AccountStatusErrorFactory";
import { User } from "@domain/entities/User"; 

@injectable()
export class LoginUseCase
  implements IUseCase<LoginRequestDto, Promise<Result<LoginResponseDto, Error>>>
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PasswordService) private passwordService: IPasswordService,
    @inject(TYPES.TokenManagementService)
    private tokenManagementService: ITokenManagementService
  ) {}

  async execute(
    dto: LoginRequestDto
  ): Promise<Result<LoginResponseDto, Error>> {
    try {
      Logger.info("Login attempt started", { email: dto.getEmailValue() });

      const userValidationResult = await this.validateUser(dto);
      if (userValidationResult.isFailure()) {
        return userValidationResult as unknown as Result<LoginResponseDto, Error>;
      }

      const user = userValidationResult.getValue();

      const accessToken = this.tokenManagementService.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      });

      const refreshTokenValue =
        this.tokenManagementService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await this.tokenManagementService.cleanupUserRefreshTokens(user.getId());

      const refreshToken = this.tokenManagementService.createRefreshTokenEntity(
        user.getId(),
        refreshTokenValue,
        refreshTokenExpiry
      );

      await this.tokenManagementService.saveRefreshToken(refreshToken);

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
        expiresIn: 3600,
      };

      Logger.info("Login successful", {
        userId: user.getId(),
        email: dto.getEmailValue(),
        role: user.getRole(),
      });

      return Result.success<LoginResponseDto, Error>(response);
    } catch (err: unknown) {
      Logger.error("Login use case error", {
        email: dto.getEmailValue(),
        error: err instanceof Error ? err.message : String(err),
      });
      return Result.failure<LoginResponseDto, Error>(
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  private async validateUser(
    dto: LoginRequestDto
  ): Promise<Result<User, Error>> {
    const user = await this.userRepository.findByEmail(dto.getEmailValue());
    if (!user) {
      Logger.warn("Login failed - user not found", {
        email: dto.getEmailValue(),
      });
      return Result.failure(new InvalidCredentialsError());
    }

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
      return Result.failure<User, Error>(
        AccountStatusErrorFactory.createError(user.getStatus())
      );
    }

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

    return Result.success<User, Error>(user);
  }
}
