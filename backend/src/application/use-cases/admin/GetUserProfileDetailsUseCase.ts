import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetUserProfileRequestDto } from "@application/dto/admin/GetUserProfileRequestDto";
import {
  GetUserProfileResponseDto,
  AdminUserProfileInfo,
  UserAccountStats,
  UserActivityStatus,
  UserProfileMetadata,
} from "@application/dto/admin/GetUserProfileResponseDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DomainError } from "@domain/errors/DomainError";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { User } from "@domain/entities/User";

@injectable()
export class GetUserProfileDetailsUseCase
  implements
    IUseCase<
      GetUserProfileRequestDto,
      Promise<Result<GetUserProfileResponseDto>>
    >
{
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    dto: GetUserProfileRequestDto
  ): Promise<Result<GetUserProfileResponseDto>> {
    try {
      Logger.info("Executing GetUserProfileUseCase", {
        userId: dto.getUserId(),
      });

      const user = (await this.userRepository.findById(
        dto.getUserId()
      )) as User | null;

      if (!user) {
        Logger.warn("User profile not found", {
          userId: dto.getUserId(),
        });
        return Result.failure(new DomainError("User not found"));
      }

      const userInfo: AdminUserProfileInfo = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmailValue(),
        mobile: user.getMobile(),
        profilePicture: user.getProfilePicture(),
        status: user.getStatus(),
        role: user.getRole(),
        isVerified: user.getIsVerified(),
        authProvider: user.getAuthProvider(),
        address: user.getAddress(),
        dob: user.getDob(),
        gender: user.getGender(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      };

      const accountStats: UserAccountStats = {
        totalBookings: 0,
        totalSpent: 0,
        lastBookingDate: null,
        joinedDaysAgo: this.calculateJoinedDaysAgo(user.getCreatedAt()),
      };

      const isActive = user.getStatus().toString() === "ACTIVE";

      const activityStatus: UserActivityStatus = {
        isActive,
        lastLoginDate: null,
      };

      const metadata: UserProfileMetadata = {
        hasCompletedProfile: this.isProfileComplete(user),
        documentVerificationStatus: undefined,
      };

      const response: GetUserProfileResponseDto = {
        userInfo,
        accountStats,
        activityStatus,
        metadata,
      };

      Logger.info("Admin user profile fetched successfully", {
        userId: dto.getUserId(),
        userRole: user.getRole(),
        userStatus: user.getStatus(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching admin user profile", {
        userId: dto.getUserId(),
        error,
      });

      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to fetch user profile")
      );
    }
  }

  private calculateJoinedDaysAgo(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isProfileComplete(user: User): boolean {
    return !!(
      user.getName() &&
      user.getEmailValue() &&
      user.getMobile() &&
      user.getAddress() &&
      user.getDob() &&
      user.getGender() &&
      user.getProfilePicture()
    );
  }
}
