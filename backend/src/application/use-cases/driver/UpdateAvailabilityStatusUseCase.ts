import { injectable, inject } from "inversify";
import { DriverAvailabilityRepository } from "@application/repositories/DriverAvailabilityRepository";
import { UpdateStatusRequestDto } from "@application/dto/driver/UpdateStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverAvailabilityNotFoundError,
  InvalidStatusTransitionError,
  ExpiredAvailabilityError,
} from "@domain/errors/DriverAvailabilityErrors";

@injectable()
export class UpdateAvailabilityStatusUseCase {
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: DriverAvailabilityRepository
  ) {}

  async execute(
    driverId: string,
    dto: UpdateStatusRequestDto
  ): Promise<
    Result<{
      id: string;
      driverId: string;
      status: string;
      updatedAt: string;
    }>
  > {
    try {
      Logger.info("Updating driver availability status", {
        driverId,
        newStatus: dto.getStatus(),
      });

      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (!availability) {
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

      if (availability.isExpired()) {
        return Result.failure(new ExpiredAvailabilityError());
      }

      try {
        availability.updateStatus(dto.getStatus());
      } catch (error) {
        if (error instanceof Error) {
          return Result.failure(
            new InvalidStatusTransitionError(
              availability.getStatus(),
              dto.getStatus()
            )
          );
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
        status: updatedAvailability.getStatus(),
        updatedAt: updatedAvailability.getUpdatedAt().toISOString(),
      };

      Logger.info("Driver availability status updated successfully", {
        driverId,
        availabilityId: updatedAvailability.getId(),
        newStatus: dto.getStatus(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating driver availability status", {
        driverId,
        newStatus: dto.getStatus(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
