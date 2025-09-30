import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@domain/services/IPasswordService";
import { ITokenService } from "@domain/services/ITokenService";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import {
  InvalidCredentialsError,
  DomainError,
  AccountStatusError,
} from "@domain/errors";
import { RefreshToken } from "@domain/entities/RefreshToken";
import { UserStatus, canUserLogin } from "@shared/constants/UserStatus";
import { LoginDto } from "../../dto/auth/LoginDto";
import { Result } from "@shared/utils/Result";

@injectable()
export class LoginUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IPasswordService") private passwordService: IPasswordService,
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IRefreshTokenRepository")
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(dto: LoginDto): Promise<Result<any, Error>> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        return Result.failure(new InvalidCredentialsError());
      }

      // Check if user can login (verified AND active status)
      if (!canUserLogin(user.getStatus(), user.getIsVerified())) {
        return Result.failure(new AccountStatusError(user.getStatus()));
      }

      // Verify password
      const isPasswordValid = await this.passwordService.compare(
        dto.password,
        user.getPassword()
      );

      if (!isPasswordValid) {
        return Result.failure(new InvalidCredentialsError());
      }

      // Generate access token
      const accessToken = this.tokenService.generate({
        userId: user.getId(),
        role: user.getRole(),
      });

      // Generate refresh token
      const refreshTokenValue = this.tokenService.generateRefreshToken();
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Delete any existing refresh tokens for this user
      await this.refreshTokenRepository.deleteByUserId(user.getId());

      // Create new refresh token
      const { v4: uuid } = require("uuid");
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
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole(),
          status: user.getStatus(),
          mobile:user.getMobile(),
        },
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
