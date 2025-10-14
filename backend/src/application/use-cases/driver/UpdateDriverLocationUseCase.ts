import { injectable, inject } from "inversify";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { UpdateLocationRequestDto } from "@application/dto/driver/UpdateLocationRequestDto";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverAvailabilityNotFoundError,
  ExpiredAvailabilityError,
} from "@domain/errors/DriverAvailabilityErrors";

@injectable()
export class UpdateDriverLocationUseCase {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: DriverAvailabilityRepository
  ) {}

  async execute(
    driverId: string,
    dto: UpdateLocationRequestDto
  ): Promise<
    Result<{
      id: string;
      driverId: string;
      currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
      };
      updatedAt: string;
    }>
  > {
    try {
      Logger.info("Updating driver location", { driverId });

      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (!availability) {
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

      if (availability.isExpired()) {
        return Result.failure(new ExpiredAvailabilityError());
      }

      const newLocation = Location.create(dto.getLocationData());

      try {
        availability.updateLocation(newLocation);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("already up to date")
        ) {
          const response = {
            id: availability.getId(),
            driverId: availability.getDriverId(),
            currentLocation: availability.getCurrentLocation().getCoordinates(),
            updatedAt: availability.getUpdatedAt().toISOString(),
          };
          return Result.success(response);
        }
        throw error;
      }

      const updatedAvailability =
        await this.availabilityRepository.save(availability);

      if (!updatedAvailability) {
        return Result.failure(
          new Error("Failed to update driver availability")
        );
      }

      const response = {
        id: updatedAvailability.getId(),
        driverId: updatedAvailability.getDriverId(),
        currentLocation: updatedAvailability
          .getCurrentLocation()
          .getCoordinates(),
        updatedAt: updatedAvailability.getUpdatedAt().toISOString(),
      };

      Logger.info("Driver location updated successfully", {
        driverId,
        availabilityId: updatedAvailability.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating driver location", {
        driverId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
