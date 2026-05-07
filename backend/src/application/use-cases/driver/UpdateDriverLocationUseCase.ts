import { injectable, inject } from "inversify";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { UpdateLocationRequestDto } from "@application/dto/driver/UpdateLocationRequestDto";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverAvailabilityNotFoundError,
} from "@domain/errors/DriverAvailabilityErrors";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateDriverLocationResponseDto } from "@application/dto/driver/UpdateDriverLocationResponseDto";

@injectable()
export class UpdateDriverLocationUseCase
  implements
    IUseCase<
      UpdateLocationRequestDto,
      Promise<Result<UpdateDriverLocationResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async execute(
    dto: UpdateLocationRequestDto
  ): Promise<Result<UpdateDriverLocationResponseDto>> {
    try {
      Logger.info("Updating driver location", dto.getDriverId());

      const availability =
        await this.availabilityRepository.findActiveByDriverId(
          dto.getDriverId()
        );
      if (!availability) {
        return Result.failure(
          new DriverAvailabilityNotFoundError(dto.getDriverId())
        );
      }

      const newLocation = Location.create(dto.getLocationData());

      try {
        availability.updateLocation(newLocation);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("already up to date")
        ) {
          const response = new UpdateDriverLocationResponseDto(
            availability.getId(),
            availability.getDriverId(),
            availability.getCurrentLocation().getCoordinates(),
            availability.getUpdatedAt().toISOString()
          );
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

      const response = new UpdateDriverLocationResponseDto(
        updatedAvailability.getId(),
        updatedAvailability.getDriverId(),
        updatedAvailability.getCurrentLocation().getCoordinates(),
        updatedAvailability.getUpdatedAt().toISOString()
      );

      Logger.info("Driver location updated successfully", {
        driverId: dto.getDriverId(),
        availabilityId: updatedAvailability.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating driver location", {
        driverId: dto.getDriverId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
