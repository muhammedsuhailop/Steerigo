import { injectable, inject } from "inversify";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { UpdateBaseLocationRequestDto } from "@application/dto/driver/UpdateBaseLocationRequestDto";
import { UpdateDriverBaseLocationResponseDto } from "@application/dto/driver/UpdateDriverBaseLocationResponseDto";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverAvailabilityNotFoundError } from "@domain/errors/DriverAvailabilityErrors";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class UpdateDriverBaseLocationUseCase implements IUseCase<
  UpdateBaseLocationRequestDto,
  Promise<Result<UpdateDriverBaseLocationResponseDto>>
> {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository,
  ) {}

  async execute(
    dto: UpdateBaseLocationRequestDto,
  ): Promise<Result<UpdateDriverBaseLocationResponseDto>> {
    try {
      Logger.info("Updating driver base location", {
        driverId: dto.getDriverId(),
      });

      const availability =
        await this.availabilityRepository.findActiveByDriverId(
          dto.getDriverId(),
        );

      if (!availability) {
        return Result.failure(
          new DriverAvailabilityNotFoundError(dto.getDriverId()),
        );
      }

      const newBaseLocation = Location.create(dto.getBaseLocationData());

      availability.updateBaseLocation(newBaseLocation);

      const updatedAvailability =
        await this.availabilityRepository.save(availability);

      if (!updatedAvailability) {
        return Result.failure(
          new Error("Failed to update driver base location"),
        );
      }

      const baseLocation = updatedAvailability.getBaseLocation();

      if (!baseLocation) {
        return Result.failure(
          new Error("Failed to update driver base location"),
        );
      }

      const response: UpdateDriverBaseLocationResponseDto = {
        availabilityId: updatedAvailability.getId(),
        driverId: updatedAvailability.getDriverId(),
        baseLocation: baseLocation.getCoordinates(),
        updatedAt: updatedAvailability.getUpdatedAt().toISOString(),
      };

      Logger.info("Driver base location updated successfully", {
        driverId: dto.getDriverId(),
        availabilityId: updatedAvailability.getId(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating driver base location", {
        driverId: dto.getDriverId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
