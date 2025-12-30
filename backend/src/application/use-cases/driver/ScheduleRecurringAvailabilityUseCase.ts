import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { ScheduleRecurringAvailabilityRequestDto } from "@application/dto/driver/ScheduleRecurringAvailabilityRequestDto";
import { DriverAvailabilityResponseDto } from "@application/dto/driver/DriverAvailabilityResponseDto";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Location } from "@domain/value-objects/Location";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  InvalidAvailabilityScheduleError,
  DriverAlreadyAvailableError,
} from "@domain/errors/DriverAvailabilityErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Types } from "mongoose";
import { TimeSlot } from "@domain/value-objects/TimeSlot";

@injectable()
export class ScheduleRecurringAvailabilityUseCase
  implements
    IUseCase<
      ScheduleRecurringAvailabilityRequestDto,
      Promise<Result<DriverAvailabilityResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverAvailabilityRepository)
    private availabilityRepository: IDriverAvailabilityRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ) {}

  async execute(
    dto: ScheduleRecurringAvailabilityRequestDto
  ): Promise<Result<DriverAvailabilityResponseDto>> {
    try {
      Logger.info("Scheduling recurring driver availability", {
        userId: dto.getUserId(),
      });

      // Validate DTO
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        return Result.failure(
          new InvalidAvailabilityScheduleError(validationErrors.join(", "))
        );
      }

      // Get driver
      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId();

      // CRITICAL: Check for existing availability (active OR inactive)
      let existingAvailability =
        await this.availabilityRepository.findActiveByDriverId(driverId);

      // If no active, check for any existing record (even inactive)
      if (!existingAvailability) {
        const allAvailability =
          await this.availabilityRepository.findByDriverId(driverId);
        if (allAvailability) {
          existingAvailability = allAvailability;
        }
      }

      let savedAvailability: DriverAvailability;

      if (existingAvailability) {
        // ALWAYS UPDATE if exists
        Logger.info("Updating existing recurring schedule", { driverId });

        existingAvailability.updateRecurringSchedule(
          {
            daysOfWeek: dto.getDaysOfWeek(),
            timeSlots: dto.getTimeSlots(),
            excludedTimeSlots: dto.getExcludedTimeSlots(),
          },
          {
            startDate: dto.getValidityStartDate(),
            endDate: dto.getValidityEndDate(),
          },
          dto.getNotes()
        );

        const location = Location.create(dto.getLocationData());
        existingAvailability.updateLocation(location);
        existingAvailability.setIsActive(true);

        savedAvailability =
          await this.availabilityRepository.save(existingAvailability);

        Logger.info("Recurring schedule updated successfully", {
          driverId,
          availabilityId: savedAvailability.getId(),
        });
      } else {
        // CREATE only if truly doesn't exist
        Logger.info("Creating new recurring schedule", { driverId });

        const availabilityId = new Types.ObjectId().toString();
        const location = Location.create(dto.getLocationData());

        const availability = DriverAvailability.createRecurring(
          availabilityId,
          driverId,
          {
            daysOfWeek: dto.getDaysOfWeek(),
            timeSlots: dto.getTimeSlots(),
            excludedTimeSlots: dto.getExcludedTimeSlots(),
          },
          {
            startDate: dto.getValidityStartDate(),
            endDate: dto.getValidityEndDate(),
          },
          location,
          dto.getNotes()
        );

        savedAvailability =
          await this.availabilityRepository.save(availability);

        Logger.info("Recurring schedule created successfully", {
          driverId,
          availabilityId: savedAvailability.getId(),
        });
      }

      // Build response
      const response = this.buildResponseDto(savedAvailability);
      return Result.success(response);
    } catch (error) {
      Logger.error("Error scheduling recurring availability", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private buildResponseDto(
    availability: DriverAvailability
  ): DriverAvailabilityResponseDto {
    const recurringSchedule = availability.getRecurringSchedule();
    const location = availability.getCurrentLocation().getCoordinates();

    let recurringScheduleDto = undefined;
    if (recurringSchedule) {
      //   const { TimeSlot } = require("@domain/value-objects/TimeSlot");
      const timeSlotDtos = recurringSchedule.dailyRecurrence.timeSlots.map(
        (slot: TimeSlot) => ({
          startTime: slot.getStartTime(),
          endTime: slot.getEndTime(),
          displayStartTime: TimeSlot.minutesToTime(slot.getStartTime()),
          displayEndTime: TimeSlot.minutesToTime(slot.getEndTime()),
        })
      );

      const excludedTimeSlotDtos = recurringSchedule.dailyRecurrence
        .excludedTimeSlots
        ? recurringSchedule.dailyRecurrence.excludedTimeSlots.map(
            (slot: TimeSlot) => ({
              startTime: slot.getStartTime(),
              endTime: slot.getEndTime(),
              displayStartTime: TimeSlot.minutesToTime(slot.getStartTime()),
              displayEndTime: TimeSlot.minutesToTime(slot.getEndTime()),
            })
          )
        : undefined;

      recurringScheduleDto = {
        dailyRecurrence: {
          daysOfWeek: recurringSchedule.dailyRecurrence.daysOfWeek,
          timeSlots: timeSlotDtos,
          excludedTimeSlots: excludedTimeSlotDtos,
        },
        validity: {
          startDate: recurringSchedule.validity.startDate.toISOString(),
          endDate: recurringSchedule.validity.endDate?.toISOString(),
        },
        notes: recurringSchedule.notes,
      };
    }

    const exceptionDtos = availability.getExceptions().map((exception) => ({
      id: exception.id,
      type: exception.type,
      reason: exception.reason,
      startTime: exception.startTime.toISOString(),
      endTime: exception.endTime.toISOString(),
      isRecurring: exception.isRecurring,
      recurringPattern: exception.recurringPattern,
      createdAt: exception.createdAt?.toISOString(),
    }));

    return new DriverAvailabilityResponseDto({
      id: availability.getId(),
      driverId: availability.getDriverId(),
      status: availability.getStatus(),
      currentLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
      recurringSchedule: recurringScheduleDto,
      exceptions: exceptionDtos,
      isActive: availability.getIsActive(),
      createdAt: availability.getCreatedAt().toISOString(),
      updatedAt: availability.getUpdatedAt().toISOString(),
    });
  }
}
