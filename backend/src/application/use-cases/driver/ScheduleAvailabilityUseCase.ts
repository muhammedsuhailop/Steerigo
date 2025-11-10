import { injectable, inject } from "inversify";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { ScheduleAvailabilityRequestDto } from "@application/dto/driver/ScheduleAvailabilityRequestDto";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { InvalidAvailabilityScheduleError } from "@domain/errors/DriverAvailabilityErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Types } from "mongoose";

@injectable()
export class ScheduleAvailabilityUseCase {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: DriverAvailabilityRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: DriverRepository
  ) {}

  async execute(
    userId: string,
    dto: ScheduleAvailabilityRequestDto
  ): Promise<
    Result<{
      id: string;
      driverId: string;
      availabilityStatus: string;
      availableFrom: string;
      availableTill: string;
      currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
      };
      createdAt: string;
    }>
  > {
    try {
      Logger.info("Scheduling driver availability", { userId });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(validationErrors.join(", "))
        );
      }

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        return Result.failure(new DriverNotFoundError(userId));
      }

      const driverId = driver.getId();
      const location = Location.create(dto.getLocationData());
      const availableFrom = dto.getAvailableFrom();
      const availableTill = dto.getAvailableTill();

      const existingAvailability =
        await this.availabilityRepository.findActiveByDriverId(driverId);

      let savedAvailability: DriverAvailability;

      if (existingAvailability) {
        existingAvailability.updateSchedule(availableFrom, availableTill);
        existingAvailability.updateLocation(location);

        savedAvailability =
          await this.availabilityRepository.save(existingAvailability);

        Logger.info("Updated existing availability", {
          driverId,
          availabilityId: savedAvailability.getId(),
        });
      } else {
        const availabilityId = new Types.ObjectId().toString();
        const availability = DriverAvailability.create(
          availabilityId,
          driverId,
          availableFrom,
          availableTill,
          location
        );

        savedAvailability =
          await this.availabilityRepository.save(availability);

        Logger.info("Created new availability", {
          driverId,
          availabilityId: savedAvailability.getId(),
        });
      }

      const response = {
        id: savedAvailability.getId(),
        driverId: savedAvailability.getDriverId(),
        availabilityStatus: savedAvailability.getStatus(),
        availableFrom: savedAvailability.getAvailableFrom().toISOString(),
        availableTill: savedAvailability.getAvailableTill().toISOString(),
        currentLocation: savedAvailability
          .getCurrentLocation()
          .getCoordinates(),
        createdAt: savedAvailability.getCreatedAt().toISOString(),
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("Error scheduling driver availability", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
