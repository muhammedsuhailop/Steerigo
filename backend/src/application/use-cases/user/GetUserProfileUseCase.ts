import { injectable, inject } from "inversify";
import { IUserProfileRepository } from "@domain/repositories/user/IUserProfileRepository";
import { GetUserProfileDto } from "../../dto/user/GetUserProfileDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { DomainError } from "@domain/errors/DomainError";

@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject("IUserProfileRepository")
    private userProfileRepository: IUserProfileRepository
  ) {}

  async execute(dto: GetUserProfileDto): Promise<Result<any>> {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const user = await this.userProfileRepository.findUserById(dto.userId);
      if (!user) {
        Logger.warn("User not found for profile fetch", {
          userId: dto.userId,
        });
        return Result.failure(new DomainError("User not found"));
      }

      if (!user.getIsVerified()) {
        Logger.warn("Unverified user attempted to access profile", {
          userId: dto.userId,
        });
        return Result.failure(new DomainError("User account not verified"));
      }

      const userProfile = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        mobile: user.getMobile(),
        dob: user.getDob()?.toISOString(),
        gender: user.getGender(),
        address: user.getAddress(),
        role: user.getRole(),
        status: user.getStatus(),
        isVerified: user.getIsVerified(),
        profilePicture: user.getProfilePicture(),
        authProvider: user.getAuthProvider(),
        createdAt: user.getCreatedAt().toISOString(),
        updatedAt: user.getUpdatedAt().toISOString(),
      };

      Logger.info("User profile fetched successfully", {
        userId: dto.userId,
        email: user.getEmail(),
      });

      return Result.success(userProfile);
    } catch (error) {
      Logger.error("Error fetching user profile", error);
      return Result.failure(error as Error);
    }
  }
}
