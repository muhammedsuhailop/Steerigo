import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RemoveAvailabilityExceptionRequestDto } from "@application/dto/driver/RemoveAvailabilityExceptionRequestDto";
import { RemoveAvailabilityExceptionResponseDto } from "@application/dto/driver/RemoveAvailabilityExceptionResponseDto";
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
export class RemoveAvailabilityExceptionUseCase
  implements
    IUseCase<
      RemoveAvailabilityExceptionRequestDto,
      Promise<Result<RemoveAvailabilityExceptionResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository,
  ) {}

  async execute(
    dto: RemoveAvailabilityExceptionRequestDto,
  ): Promise<Result<RemoveAvailabilityExceptionResponseDto>> {
    try {
      Logger.info("Removing availability exception", {
        userId: dto.getUserId(),
        exceptionId: dto.getExceptionId(),
      });

      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(validationErrors.join(", ")),
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
      const exceptionExists = currentExceptions.some(
        (e) => e.id === dto.getExceptionId(),
      );

      if (!exceptionExists) {
        return Result.failure(
          new AvailabilityExceptionNotFoundError(dto.getExceptionId()),
        );
      }

      const removeSucceeded = availability.removeException(
        dto.getExceptionId(),
      );

      if (!removeSucceeded) {
        return Result.failure(
          new AvailabilityExceptionNotFoundError(dto.getExceptionId()),
        );
      }

      await this.availabilityRepository.save(availability);

      Logger.info("Exception removed successfully", {
        driverId,
        exceptionId: dto.getExceptionId(),
      });

      const responseDto: RemoveAvailabilityExceptionResponseDto = {
        exceptionId: dto.getExceptionId(),
        message: "Exception removed successfully",
      };

      return Result.success(responseDto);
    } catch (error) {
      Logger.error("Error removing availability exception", {
        userId: dto.getUserId(),
        exceptionId: dto.getExceptionId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
