import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetCurrentUserDto } from "../../dto/auth/GetCurrentUserDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { DomainError } from "@domain/errors/DomainError";

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(dto: GetCurrentUserDto): Promise<Result<any>> {
    try {
      const user = await this.userRepository.findById(dto.userId);

      if (!user) {
        Logger.warn("User not found for getCurrentUser", {
          userId: dto.userId,
        });
        return Result.failure(new DomainError("User not found"));
      }

      if (!user.getIsVerified()) {
        Logger.warn("Unverified user attempted to access getCurrentUser", {
          userId: dto.userId,
        });
        return Result.failure(new DomainError("User account not verified"));
      }

      const userData = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        mobile: user.getMobile(),
        role: user.getRole(),
        status: user.getStatus(),
        isVerified: user.getIsVerified(),
        createdAt: user.getCreatedAt().toISOString(),
        updatedAt: user.getUpdatedAt().toISOString(),
        profilePicture: user.getProfilePicture(),
        authProvider: user.getAuthProvider(),
        dob: user.getDob()?.toISOString(),
        gender: user.getGender(),
        address: user.getAddress(),
      };

      Logger.info("Current user data fetched successfully", {
        userId: dto.userId,
        email: user.getEmail(),
      });

      return Result.success(userData);
    } catch (error) {
      Logger.error("Error fetching current user", error);
      return Result.failure(error as Error);
    }
  }
}
