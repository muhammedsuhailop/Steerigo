import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverUpdateRequestDto } from "@application/dto/driver/DriverUpdateRequestDto";
import { DriverResponseDto } from "@application/dto/driver/DriverResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class UpdateDriverProfileUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository
  ) {}

  async execute(
    userId: string,
    dto: DriverUpdateRequestDto
  ): Promise<Result<DriverResponseDto>> {
    try {
      Logger.info("Update driver profile started", { userId });

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DomainError("Driver profile not found"));
      }

      const licenseExpiryDate = dto.getLicenseExpiryDate();
      const licenseIssueDate = dto.getLicenseIssueDate();

      if (licenseExpiryDate && licenseIssueDate) {
        if (licenseExpiryDate <= licenseIssueDate) {
          return Result.failure(
            new DomainError("License expiry date must be after issue date")
          );
        }
      }

      const eligibleGearTypes = dto.getEligibleGearTypes();
      const eligibleBodyTypes = dto.getEligibleBodyTypes();

      if (eligibleGearTypes && eligibleBodyTypes) {
        driver.updateEligibleVehicles(eligibleGearTypes, eligibleBodyTypes);
      }

      const licenceCategory = dto.getLicenceCategory();

      if (licenceCategory && licenseIssueDate && licenseExpiryDate) {
        driver.updateLicenseInfo(
          licenceCategory,
          licenseIssueDate,
          licenseExpiryDate
        );
      }

      const updatedDriver = await this.driverRepository.save(driver);

      if (!updatedDriver) {
        return Result.failure(
          new DomainError("Failed to update driver profile")
        );
      }

      const response: DriverResponseDto = {
        id: updatedDriver.getId(),
        userId: updatedDriver.getUserId(),
        eligibleGearTypes: updatedDriver.getEligibleGearTypes(),
        eligibleBodyTypes: updatedDriver.getEligibleBodyTypes(),
        licenceCategory: updatedDriver.getLicenceCategory(),
        licenseIssueDate: updatedDriver.getLicenseIssueDate(),
        licenseExpiryDate: updatedDriver.getLicenseExpiryDate(),
        kycStatus: updatedDriver.getKycStatus(),
        status: updatedDriver.getStatus(),
        createdAt: updatedDriver.getCreatedAt(),
        updatedAt: updatedDriver.getUpdatedAt(),
      };

      Logger.info("Update driver profile successful", {
        userId,
        driverId: updatedDriver.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Update driver profile failed", { userId, error });
      return Result.failure(error as Error);
    }
  }
}
