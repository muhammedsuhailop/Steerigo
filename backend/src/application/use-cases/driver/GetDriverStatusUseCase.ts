import { injectable, inject } from "inversify";
import { IDriverRepository } from "@application/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@application/repositories/IDriverAvailabilityRepository";
import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import {
  DriverAvailabilityNotFoundError,
  DriverProfileNotFoundError,
} from "@domain/errors/DriverAvailabilityErrors";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetDriverStatusUseCase
  implements IUseCase<string, Promise<Result<DriverStatusResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async execute(userId: string): Promise<Result<DriverStatusResponseDto>> {
    try {
      Logger.info("Get driver status started", { userId });

      if (!userId || userId.trim() === "") {
        return Result.failure(new DomainError("User ID is required"));
      }

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        Logger.warn("Driver profile not found", { userId });
        return Result.failure(new DriverProfileNotFoundError(userId));
      }

      const driverId = driver.getId();

      const availability =
        await this.availabilityRepository.findByDriverId(driverId);
      if (!availability) {
        Logger.warn("Driver availability not found", { driverId });
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

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
