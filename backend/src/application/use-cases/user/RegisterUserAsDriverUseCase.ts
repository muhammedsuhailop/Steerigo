import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { RegisterAsDriverRequestDto } from "@application/dto/user/RegisterAsDriverRequestDto";
import { RegisterAsDriverResponseDto } from "@application/dto/user/RegisterAsDriverResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { Driver } from "@domain/entities/Driver";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { Types } from "mongoose";

@injectable()
export class RegisterUserAsDriverUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository
  ) {}

  async execute(
    dto: RegisterAsDriverRequestDto
  ): Promise<Result<RegisterAsDriverResponseDto>> {
    try {
      Logger.info("Register user as driver started", { userId: dto.userId });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(new DomainError(validationErrors.join(", ")));
      }

      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      if (!user.getIsVerified()) {
        return Result.failure(
          new DomainError(
            "User account must be verified before registering as driver"
          )
        );
      }

      const currentRole = user.getRole();
      if (currentRole === "Driver") {
        return Result.failure(
          new DomainError("User is already registered as a driver")
        );
      }

      if (currentRole === "Admin") {
        return Result.failure(
          new DomainError("Admin users cannot register as drivers")
        );
      }

      const existingDriver = await this.driverRepository.findByUserId(
        dto.userId
      );
      if (existingDriver) {
        return Result.failure(
          new DomainError("Driver profile already exists for this user")
        );
      }

      user.updateRole("Driver");
      await this.userRepository.save(user);

      const response: RegisterAsDriverResponseDto = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail().getValue(),
        mobile: user.getMobile(),
        role: user.getRole(),
        status: user.getStatus(),
        isVerified: user.getIsVerified(),
        updatedAt: user.getUpdatedAt().toISOString(),
        message:
          "Successfully registered as driver. Please complete your driver profile and submit required documents.",
      };

      Logger.info("User registered as driver successfully", {
        userId: dto.userId,
        previousRole: currentRole,
        newRole: "Driver",
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Register user as driver failed", {
        userId: dto.userId,
        error,
      });
      return Result.failure(error as Error);
    }
  }
}
