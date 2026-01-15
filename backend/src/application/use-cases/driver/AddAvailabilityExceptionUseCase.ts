import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { AddAvailabilityExceptionRequestDto } from "@application/dto/driver/AddAvailabilityExceptionRequestDto";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  InvalidAvailabilityScheduleError,
  DriverAvailabilityNotFoundError,
} from "@domain/errors/DriverAvailabilityErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Types } from "mongoose";
import { AddAvailabilityExceptionResponseDto } from "@application/dto/driver/AddAvailabilityExceptionResponseDto";

@injectable()
export class AddAvailabilityExceptionUseCase
  implements
    IUseCase<
      AddAvailabilityExceptionRequestDto,
      Promise<Result<AddAvailabilityExceptionResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,

    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository
  ) {}

  async execute(
    dto: AddAvailabilityExceptionRequestDto
  ): Promise<Result<AddAvailabilityExceptionResponseDto>> {
    try {
      Logger.info("Adding availability exception", {
        userId: dto.getUserId(),
        type: dto.getType(),
      });

      // Validate DTO
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(validationErrors.join(", "))
        );
      }

      // Get driver from userId
      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId();

      // Get active availability
      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (!availability) {
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

      // Create exception
      const exception = {
        id: new Types.ObjectId().toString(),
        type: dto.getType(),
        reason: dto.getReason(),

        startTime: dto.getStartTime(),
        endTime: dto.getEndTime(),

        isRecurring: dto.getIsRecurring(),
        recurringPattern: dto.getRecurringPattern(),

        recurrenceStartDate: dto.getRecurrenceStartDate(),
        recurrenceEndDate: dto.getRecurrenceEndDate(),

        createdAt: new Date(),
      };

      // Add exception to availability
      availability.addException(exception);

      // Save updated availability
      await this.availabilityRepository.save(availability);

      Logger.info("Exception added successfully", {
        driverId,
        exceptionType: dto.getType(),
        exceptionId: exception.id,
      });

      // Response DTO
      const responseDto: AddAvailabilityExceptionResponseDto = {
        id: exception.id,
        type: exception.type,
        reason: exception.reason,
        startTime: exception.startTime.toISOString(),
        endTime: exception.endTime.toISOString(),
        isRecurring: exception.isRecurring,
        recurringPattern: exception.recurringPattern,
        recurrenceStartDate: exception.recurrenceStartDate?.toISOString(),
        recurrenceEndDate: exception.recurrenceEndDate?.toISOString(),

        createdAt: exception.createdAt?.toISOString(),
      };

      return Result.success(responseDto);
    } catch (error) {
      Logger.error("Error adding availability exception", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
