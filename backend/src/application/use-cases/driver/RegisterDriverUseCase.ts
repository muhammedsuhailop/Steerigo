import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { UserRepository } from "@application/repositories/UserRepository";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverResponseDto } from "@application/dto/driver/DriverResponseDto";
import { Result } from "@shared/utils/Result";
import { Driver } from "@domain/entities/Driver";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { UserRole } from "@shared/constants/AuthConstants";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

@injectable()
export class RegisterDriverUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async execute(
    userId: string,
    dto: DriverRegistrationRequestDto
  ): Promise<Result<DriverResponseDto>> {
    try {
      Logger.info("Driver registration started", { userId });

      // Validate user exists and is not already a driver
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      // Check if user is already registered as driver
      const existingDriver = await this.driverRepository.findByUserId(userId);
      if (existingDriver) {
        return Result.failure(
          new DomainError("User is already registered as a driver")
        );
      }

      // Validate license dates
      const now = new Date();
      if (dto.getLicenseExpiryDate() <= now) {
        return Result.failure(
          new DomainError("License expiry date must be in the future")
        );
      }

      if (dto.getLicenseIssueDate() > now) {
        return Result.failure(
          new DomainError("License issue date cannot be in the future")
        );
      }

      const driverId = new Types.ObjectId().toString();

      // Create driver entity
      const driver = Driver.create(
        driverId,
        userId,
        dto.getEligibleGearTypes(),
        dto.getEligibleBodyTypes(),
        dto.getLicenceCategory(),
        dto.getLicenseIssueDate(),
        dto.getLicenseExpiryDate()
      );

      // Save driver
      const savedDriver = await this.driverRepository.save(driver);

      if (!savedDriver) {
        return Result.failure(new DomainError("Failed to save driver"));
      }

      // Update user role to DRIVER if not already
      if (user.getRole() !== UserRole.DRIVER) {
        Logger.info("User role should be updated to DRIVER", { userId });
      }

      const response: DriverResponseDto = {
        id: savedDriver.getId(),
        userId: savedDriver.getUserId(),
        eligibleGearTypes: savedDriver.getEligibleGearTypes(),
        eligibleBodyTypes: savedDriver.getEligibleBodyTypes(),
        licenceCategory: savedDriver.getLicenceCategory(),
        licenseIssueDate: savedDriver.getLicenseIssueDate(),
        licenseExpiryDate: savedDriver.getLicenseExpiryDate(),
        kycStatus: savedDriver.getKycStatus(),
        status: savedDriver.getStatus(),
        createdAt: savedDriver.getCreatedAt(),
        updatedAt: savedDriver.getUpdatedAt(),
      };

      Logger.info("Driver registration successful", {
        userId,
        driverId: savedDriver.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Driver registration failed", { userId, error });
      return Result.failure(error as Error);
    }
  }
}
