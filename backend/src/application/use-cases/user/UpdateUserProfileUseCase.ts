import { injectable, inject } from "inversify";
import { IUserProfileRepository } from "@domain/repositories/user/IUserProfileRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UpdateUserProfileDto } from "../../dto/user/UpdateUserProfileDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { DomainError } from "@domain/errors/DomainError";

@injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @inject("IUserProfileRepository")
    private userProfileRepository: IUserProfileRepository,
    @inject("IUserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(dto: UpdateUserProfileDto): Promise<Result<any>> {
    try {
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      if (!dto.hasUpdates()) {
        return Result.failure(new DomainError("No updates provided"));
      }

      // Check if user exists and is verified
      const existingUser = await this.userProfileRepository.findUserById(dto.userId);
      if (!existingUser) {
        return Result.failure(new DomainError("User not found"));
      }

      if (!existingUser.getIsVerified()) {
        return Result.failure(new DomainError("User account not verified"));
      }

      // Check mobile number uniqueness if mobile is being updated
      if (dto.mobile && dto.mobile !== existingUser.getMobile()) {
        const mobileExists = await this.userRepository.existsByMobile(dto.mobile);
        if (mobileExists) {
          return Result.failure(new DomainError("Mobile number already registered"));
        }
      }

      // Prepare updates object
      const updates: any = {};
      if (dto.name) updates.name = dto.name;
      if (dto.mobile) updates.mobile = dto.mobile;
      if (dto.dob) updates.dob = new Date(dto.dob);
      if (dto.gender) updates.gender = dto.gender;
      if (dto.address !== undefined) updates.address = dto.address;

      // Update user profile
      const updatedUser = await this.userProfileRepository.updateUserProfile(
        dto.userId,
        updates
      );

      if (!updatedUser) {
        return Result.failure(new DomainError("Failed to update user profile"));
      }

      const userProfile = {
        id: updatedUser.getId(),
        name: updatedUser.getName(),
        email: updatedUser.getEmail(),
        mobile: updatedUser.getMobile(),
        dob: updatedUser.getDob()?.toISOString(),
        gender: updatedUser.getGender(),
        address: updatedUser.getAddress(),
        role: updatedUser.getRole(),
        status: updatedUser.getStatus(),
        isVerified: updatedUser.getIsVerified(),
        profilePicture: updatedUser.getProfilePicture(),
        authProvider: updatedUser.getAuthProvider(),
        createdAt: updatedUser.getCreatedAt().toISOString(),
        updatedAt: updatedUser.getUpdatedAt().toISOString(),
      };

      Logger.info("User profile updated successfully", {
        userId: dto.userId,
        updates: Object.keys(updates),
      });

      return Result.success(userProfile);
    } catch (error) {
      Logger.error("Error updating user profile", error);
      return Result.failure(error as Error);
    }
  }
}