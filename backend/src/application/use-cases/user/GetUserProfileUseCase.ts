import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { UserResponseDto } from "@application/dto/user/UserResponseDto";
import { GetUserProfileDto } from "@application/dto/user/GetUserProfileDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(dto: GetUserProfileDto): Promise<Result<UserResponseDto>> {
    try {
      Logger.info("Get user profile started", { userId: dto.userId });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      if (!user.getIsVerified()) {
        return Result.failure(new DomainError("User account not verified"));
      }

      const response: UserResponseDto = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        mobile: user.getMobile(),
        dob: user.getDob()?.toISOString(),
        gender: user.getGender() as "Male" | "Female" | "Other" | undefined,
        address: user.getAddress(),
        role: user.getRole(),
        status: user.getStatus(),
        isVerified: user.getIsVerified(),
        profilePicture: user.getProfilePicture(),
        authProvider: user.getAuthProvider(),
        createdAt: user.getCreatedAt().toISOString(),
        updatedAt: user.getUpdatedAt().toISOString(),
      };

      Logger.info("Get user profile successful", {
        userId: dto.userId,
        email: user.getEmail(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Get user profile failed", { userId: dto.userId, error });
      return Result.failure(error as Error);
    }
  }
}
