import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
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
import { DriverStatusMapper } from "@application/mappers/driver/DriverStatusMapper";
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

      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        Logger.warn("Driver profile not found", { userId });
        return Result.failure(new DriverProfileNotFoundError(userId));
      }

      const driverId = driver.getId();
      Logger.debug("Driver profile found", { driverId, userId });

      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (!availability) {
        Logger.warn("Driver availability not found", { driverId });
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

      Logger.debug("Driver availability found", {
        driverId,
        status: availability.getStatus(),
        hasRecurringSchedule: !!availability.getRecurringSchedule(),
        exceptionsCount: availability.getExceptions().length,
      });

      const response = DriverStatusMapper.toDtoFromEntity(availability);

      Logger.info("Driver status fetched successfully", {
        userId,
        driverId,
        availabilityStatus: response.availabilityStatus,
        recurringScheduleActive: response.recurringSchedule?.isActive,
        activeExceptions: response.activeExceptionsCount,
        currentlyAvailable: response.summary.isCurrentlyAvailable,
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver status", { userId, error });
      if (error instanceof DomainError) {
        return Result.failure(error);
      }
      return Result.failure(
        new DomainError(
          "Failed to fetch driver status. Please try again later."
        )
      );
    }
  }
}
