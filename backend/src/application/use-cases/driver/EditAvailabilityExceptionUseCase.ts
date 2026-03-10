import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { EditAvailabilityExceptionRequestDto } from "@application/dto/driver/EditAvailabilityExceptionRequestDto";
import { EditAvailabilityExceptionResponseDto } from "@application/dto/driver/EditAvailabilityExceptionResponseDto";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  InvalidAvailabilityScheduleError,
  DriverAvailabilityNotFoundError,
  AvailabilityExceptionNotFoundError,
} from "@domain/errors/DriverAvailabilityErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";

@injectable()
export class EditAvailabilityExceptionUseCase
  implements
    IUseCase<
      EditAvailabilityExceptionRequestDto,
      Promise<Result<EditAvailabilityExceptionResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository,
  ) {}

  async execute(
    dto: EditAvailabilityExceptionRequestDto,
  ): Promise<Result<EditAvailabilityExceptionResponseDto>> {
    try {
      Logger.info("Editing availability exception", {
        userId: dto.getUserId(),
        exceptionId: dto.getExceptionId(),
      });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(validationErrors.join(", ")),
        );
      }

      if (!dto.hasChanges()) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(
            "No changes provided for update",
          ),
        );
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId();

      const availability =
        await this.availabilityRepository.findActiveByDriverId(driverId);
      if (!availability) {
        return Result.failure(new DriverAvailabilityNotFoundError(driverId));
      }

      const currentExceptions = availability.getExceptions();
      const exceptionToUpdate = currentExceptions.find(
        (e) => e.id === dto.getExceptionId(),
      );

      if (!exceptionToUpdate) {
        return Result.failure(
          new AvailabilityExceptionNotFoundError(dto.getExceptionId()),
        );
      }

      const updates: Record<string, unknown> = {};

      if (dto.getType() !== undefined) {
        updates.type = dto.getType();
      }

      if (dto.getReason() !== undefined) {
        updates.reason = dto.getReason();
      }

      if (dto.getStartTime() !== undefined) {
        updates.startTime = dto.getStartTime();
      }

      if (dto.getEndTime() !== undefined) {
        updates.endTime = dto.getEndTime();
      }

      const updateSucceeded = availability.updateException(
        dto.getExceptionId(),
        updates as Parameters<typeof availability.updateException>[1],
      );

      if (!updateSucceeded) {
        return Result.failure(
          new AvailabilityExceptionNotFoundError(dto.getExceptionId()),
        );
      }

      await this.availabilityRepository.save(availability);

      Logger.info("Exception edited successfully", {
        driverId,
        exceptionId: dto.getExceptionId(),
      });

      const updatedException = availability
        .getExceptions()
        .find((e) => e.id === dto.getExceptionId())!;

      const responseDto: EditAvailabilityExceptionResponseDto = {
        id: updatedException.id as string,
        type: updatedException.type,
        reason: updatedException.reason,
        startTime: updatedException.startTime.toISOString(),
        endTime: updatedException.endTime.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return Result.success(responseDto);
    } catch (error) {
      Logger.error("Error editing availability exception", {
        userId: dto.getUserId(),
        exceptionId: dto.getExceptionId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
