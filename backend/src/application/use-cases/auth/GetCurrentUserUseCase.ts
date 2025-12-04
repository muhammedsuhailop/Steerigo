import { injectable, inject } from "inversify";
import { IUserRepository } from "@application/repositories/IUserRepository";
import { GetCurrentUserDto } from "../../dto/auth/GetCurrentUserDto";
import { GetCurrentUserResponseDto } from "../../dto/auth/GetCurrentUserResponseDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { UserNotFoundError } from "@domain/errors";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetCurrentUserUseCase
  implements
    IUseCase<GetCurrentUserDto, Promise<Result<GetCurrentUserResponseDto>>>
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    dto: GetCurrentUserDto
  ): Promise<Result<GetCurrentUserResponseDto>> {
    try {
      Logger.info("Get current user started", { userId: dto.getUserId() });

      const user = await this.userRepository.findById(dto.getUserId());
      if (!user) {
        Logger.warn("Get current user failed - user not found", {
          userId: dto.getUserId(),
        });
        return Result.failure(new UserNotFoundError());
      }

      const response: GetCurrentUserResponseDto = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmailValue(),
        mobile: user.getMobile() ?? "",
        role: user.getRole(),
        status: user.getStatus(),
        profilePicture: user.getProfilePicture(),
        isVerified: user.getIsVerified(),
        authProvider: user.getAuthProvider(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      };

      Logger.info("Get current user completed successfully", {
        userId: dto.getUserId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Get current user use case error", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
