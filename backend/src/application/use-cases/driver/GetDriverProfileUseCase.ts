import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverResponseDto } from "@application/dto/driver/DriverResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetDriverProfileUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository
  ) {}

  async execute(userId: string): Promise<Result<DriverResponseDto>> {
    try {
      Logger.info("Get driver profile started", { userId });

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DomainError("Driver profile not found"));
      }

      const response: DriverResponseDto = {
        id: driver.getId(),
        userId: driver.getUserId(),
        eligibleGearTypes: driver.getEligibleGearTypes(),
        eligibleBodyTypes: driver.getEligibleBodyTypes(),
        licenceCategory: driver.getLicenceCategory(),
        licenseIssueDate: driver.getLicenseIssueDate(),
        licenseExpiryDate: driver.getLicenseExpiryDate(),
        kycStatus: driver.getKycStatus(),
        status: driver.getStatus(),
        createdAt: driver.getCreatedAt(),
        updatedAt: driver.getUpdatedAt(),
      };

      Logger.info("Get driver profile successful", {
        userId,
        driverId: driver.getId(),
      });
      return Result.success(response);
    } catch (error) {
      Logger.error("Get driver profile failed", { userId, error });
      return Result.failure(error as Error);
    }
  }
}
