import { injectable, inject } from "inversify";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { ScheduleAvailabilityRequestDto } from "@application/dto/driver/ScheduleAvailabilityRequestDto";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverAlreadyAvailableError,
  InvalidAvailabilityScheduleError,
} from "@domain/errors/DriverAvailabilityErrors";
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
      status: string;
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

      const existingAvailability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (existingAvailability) {
        return Result.failure(new DriverAlreadyAvailableError(driverId));
      }

      const conflictingSchedule =
        await this.availabilityRepository.findConflictingSchedule(
          driverId,
          dto.getAvailableFrom(),
          dto.getAvailableTill()
        );

      if (conflictingSchedule) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(
            "Schedule conflicts with existing availability"
          )
        );
      }

      const location = Location.create(dto.getLocationData());

      const availabilityId = new Types.ObjectId();

      const availability = DriverAvailability.create(
        availabilityId.toString(),
        driverId,
        dto.getAvailableFrom(),
        dto.getAvailableTill(),
        location
      );

      const savedAvailability =
        await this.availabilityRepository.save(availability);

      if (!savedAvailability) {
        return Result.failure(new Error("Failed to save driver availability"));
      }
      const response = {
        id: savedAvailability.getId(),
        driverId: savedAvailability.getDriverId(),
        status: savedAvailability.getStatus(),
        availableFrom: savedAvailability.getAvailableFrom().toISOString(),
        availableTill: savedAvailability.getAvailableTill().toISOString(),
        currentLocation: savedAvailability
          .getCurrentLocation()
          .getCoordinates(),
        createdAt: savedAvailability.getCreatedAt().toISOString(),
      };

      Logger.info("Driver availability scheduled successfully", {
        driverId,
        availabilityId: savedAvailability.getId(),
      });

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
