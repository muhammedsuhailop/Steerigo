import { injectable, inject } from "inversify";
import { IDriverAvailabilityRepository } from "@application/repositories/IDriverAvailabilityRepository";
import { UpdateStatusRequestDto } from "@application/dto/driver/UpdateStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  DriverAvailabilityNotFoundError,
  InvalidStatusTransitionError,
  ExpiredAvailabilityError,
} from "@domain/errors/DriverAvailabilityErrors";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateAvailabilityStatusResponseDto } from "@application/dto/driver/UpdateAvailabilityStatusResponseDto";

@injectable()
export class UpdateAvailabilityStatusUseCase
  implements
    IUseCase<
      UpdateStatusRequestDto,
      Promise<Result<UpdateAvailabilityStatusResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async execute(
    dto: UpdateStatusRequestDto
  ): Promise<Result<UpdateAvailabilityStatusResponseDto>> {
    try {
      Logger.info("Updating driver availability status", {
        driverId: dto.getDriverId(),
        newStatus: dto.getStatus(),
      });

      const availability =
        await this.availabilityRepository.findActiveByDriverId(
          dto.getDriverId()
        );
      if (!availability) {
        return Result.failure(
          new DriverAvailabilityNotFoundError(dto.getDriverId())
        );
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

      const response = new UpdateAvailabilityStatusResponseDto(
        updatedAvailability.getId(),
        updatedAvailability.getDriverId(),
        updatedAvailability.getStatus(),
        updatedAvailability.getUpdatedAt().toISOString()
      );

      Logger.info("Driver availability status updated successfully", {
        driverId: dto.getDriverId(),
        availabilityId: updatedAvailability.getId(),
        newStatus: dto.getStatus(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error updating driver availability status", {
        driverId: dto.getDriverId(),
        newStatus: dto.getStatus(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
