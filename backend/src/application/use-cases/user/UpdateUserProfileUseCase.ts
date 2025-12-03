import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { UpdateUserProfileDto } from "@application/dto/user/UpdateUserProfileDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { UserProfileUpdateResponseDto } from "@application/dto/user/UserProfileUpdateResponseDto";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class UpdateUserProfileUseCase
  implements
    IUseCase<
      UpdateUserProfileDto,
      Promise<Result<UserProfileUpdateResponseDto>>
    >
{
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(
    dto: UpdateUserProfileDto
  ): Promise<Result<UserProfileUpdateResponseDto>> {
    try {
      Logger.info("Update user profile started", { userId: dto.userId });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      if (!dto.hasUpdates()) {
        return Result.failure(new DomainError("No updates provided"));
      }

      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      if (!user.getIsVerified()) {
        return Result.failure(new DomainError("User account not verified"));
      }

      const updatedFields: string[] = [];

      // Check mobile uniqueness if mobile is being updated
      if (dto.mobile && dto.mobile !== user.getMobile()) {
        const mobileExists = await this.userRepository.existsByMobile(
          dto.mobile
        );
        if (mobileExists) {
          return Result.failure(
            new DomainError("Mobile number already registered")
          );
        }
      }

      // Update user profile
      const profileUpdates = dto.getUserProfileUpdates();
      if (Object.keys(profileUpdates).length > 0) {
        user.updateProfile(profileUpdates);
        await this.userRepository.save(user);
        updatedFields.push(...Object.keys(profileUpdates));

        Logger.info("User profile updated", {
          userId: dto.userId,
          updates: Object.keys(profileUpdates),
        });
      }

      const updatedUser = await this.userRepository.findById(dto.userId);
      if (!updatedUser) {
        return Result.failure(
          new DomainError("Failed to retrieve updated user")
        );
      }

      const response: UserProfileUpdateResponseDto = {
        user: {
          id: updatedUser.getId(),
          name: updatedUser.getName(),
          email: updatedUser.getEmail().getValue(),
          mobile: updatedUser.getMobile(),
          dob: updatedUser.getDob()?.toISOString(),
          gender: updatedUser.getGender() as
            | "Male"
            | "Female"
            | "Other"
            | undefined,
          address: updatedUser.getAddress(),
          role: updatedUser.getRole(),
          status: updatedUser.getStatus(),
          isVerified: updatedUser.getIsVerified(),
          profilePicture: updatedUser.getProfilePicture(),
          authProvider: updatedUser.getAuthProvider(),
          createdAt: updatedUser.getCreatedAt().toISOString(),
          updatedAt: updatedUser.getUpdatedAt().toISOString(),
        },
        updatedFields,
      };

      Logger.info("User profile update successful", {
        userId: dto.userId,
        updatedFields,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Update user profile failed", { userId: dto.userId, error });
      return Result.failure(error as Error);
    }
  }
}
