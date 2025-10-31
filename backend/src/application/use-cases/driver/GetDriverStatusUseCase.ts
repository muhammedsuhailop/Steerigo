import { injectable, inject } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetDriverStatusUseCase {
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: DriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: DriverAvailabilityRepository
  ) {}

  /**
   * Get driver's current status and availability
   * Flow:
   * 1. Extract userId from input
   * 2. Find driver by userId
   * 3. Get driver's availability status from DriverAvailabilityRepository
   * 4. Map to response DTO
   */
  async execute(userId: string): Promise<Result<DriverStatusResponseDto>> {
    try {
      Logger.info("Get driver status started", { userId });

      // Step 1: Validate userId
      if (!userId || userId.trim() === "") {
        return Result.failure(new DomainError("User ID is required"));
      }

      // Step 2: Find driver by userId
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        Logger.warn("Driver profile not found", { userId });
        return Result.failure(new DomainError("Driver profile not found"));
      }

      const driverId = driver.getId();

      // Step 3: Get driver's availability status
      const availability =
        await this.availabilityRepository.findByDriverId(driverId);
      if (!availability) {
        Logger.warn("Driver availability not found", { driverId });
        return Result.failure(
          new DomainError("Driver availability status not found")
        );
      }

      // Step 4: Map to response DTO
      const response = new DriverStatusResponseDto(
        availability.getId(),
        driverId,
        availability.getStatus(),
        availability.getAvailableFrom(),
        availability.getAvailableTill(),
        {
          latitude: availability.getCurrentLocation().getLatitude(),
          longitude: availability.getCurrentLocation().getLongitude(),
          address: availability.getCurrentLocation().getAddress(),
        },
        availability.getUpdatedAt()
      );

      Logger.info("Driver status fetched successfully", { userId, driverId });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver status", { userId, error });
      return Result.failure(
        error instanceof DomainError
          ? error
          : new DomainError("Failed to fetch driver status")
      );
    }
  }
}
