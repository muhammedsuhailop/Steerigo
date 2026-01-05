import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import {
  DriverStatusResponseDto,
  TimeSlotResponse,
  DailyRecurrenceResponse,
  ScheduleValidityResponse,
  RecurringScheduleResponse,
  AvailabilityExceptionResponse,
  LocationResponse,
  AvailabilitySummaryResponse,
} from "@application/dto/driver/DriverStatusResponseDto";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import {
  DriverAvailabilityNotFoundError,
  DriverProfileNotFoundError,
} from "@domain/errors/DriverAvailabilityErrors";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityExceptionData } from "@domain/entities/DriverAvailability";
import { TimeSlot } from "@domain/value-objects/TimeSlot";
import { Location } from "@domain/value-objects/Location";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";

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

      const validationResult = this.validateInput(userId);
      if (!validationResult.isValid) {
        return Result.failure(
          new DomainError(validationResult.error as string)
        );
      }

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

      const response = this.buildDriverStatusResponse(availability);

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

  private buildDriverStatusResponse(
    availability: DriverAvailability
  ): DriverStatusResponseDto {
    const id = availability.getId();
    const driverId = availability.getDriverId();
    const availabilityStatus = availability.getStatus();
    const isActive = availability.getIsActive();
    const createdAt = availability.getCreatedAt();
    const updatedAt = availability.getUpdatedAt();

    const currentLocation = this.transformLocation(
      availability.getCurrentLocation()
    );

    const domainSchedule = availability.getRecurringSchedule();
    const recurringSchedule = domainSchedule
      ? this.transformRecurringSchedule(domainSchedule)
      : null;

    const domainExceptions = availability.getExceptions();
    const exceptions = domainExceptions.map((exc) =>
      this.transformException(exc)
    );
    const activeExceptionsCount = exceptions.filter(
      (exc) => exc.isActive
    ).length;

    const todayTimeSlots = this.calculateTodayTimeSlots(
      recurringSchedule,
      exceptions
    );

    const summary = this.generateSummary(
      availabilityStatus,
      recurringSchedule,
      exceptions,
      todayTimeSlots
    );

    const response: DriverStatusResponseDto = {
      id,
      driverId,
      availabilityStatus,
      currentLocation,
      lastLocationUpdateAt: new Date(),
      recurringSchedule,
      exceptions,
      activeExceptionsCount,
      summary,
      todayTimeSlots,
      isActive,
      createdAt,
      updatedAt,
    };

    return response;
  }

  private transformLocation(domainLocation: Location): LocationResponse {
    const coordinates = domainLocation.getCoordinates();
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      address: coordinates.address,
      lastUpdatedAt: new Date(),
      accuracy: 10,
    };
  }

  private transformRecurringSchedule(
    domainSchedule: ReturnType<DriverAvailability["getRecurringSchedule"]>
  ): RecurringScheduleResponse {
    if (!domainSchedule) {
      throw new Error("Recurring schedule is required");
    }

    const dailyRecurrence = domainSchedule.dailyRecurrence;

    const timeSlots = dailyRecurrence.timeSlots.map((slot: TimeSlot) =>
      this.minutesToTimeSlot(slot.getStartTime(), slot.getEndTime())
    );

    const excludedTimeSlots = (
      domainSchedule.dailyRecurrence.excludedTimeSlots || []
    ).map((slot: TimeSlot) =>
      this.minutesToTimeSlot(slot.getStartTime(), slot.getEndTime())
    );

    const daysOfWeek = dailyRecurrence.daysOfWeek;
    const daysOfWeekLabels = this.getDayLabels(daysOfWeek);

    const validity = domainSchedule.validity;
    const now = new Date();
    const isCurrentlyValid = this.isValidityActive(validity, now);

    const dailyRecurrenceResponse: DailyRecurrenceResponse = {
      daysOfWeek,
      timeSlots,
      excludedTimeSlots,
      daysOfWeekLabels,
    };

    const scheduleValidityResponse: ScheduleValidityResponse = {
      startDate: validity.startDate,
      endDate: validity.endDate || null,
      isCurrentlyValid,
    };

    const recurringScheduleResponse: RecurringScheduleResponse = {
      dailyRecurrence: dailyRecurrenceResponse,
      validity: scheduleValidityResponse,
      notes: domainSchedule.notes,
      isActive: isCurrentlyValid,
    };

    return recurringScheduleResponse;
  }

  private transformException(
    domainException: AvailabilityExceptionData
  ): AvailabilityExceptionResponse {
    const startTime = domainException.startTime;
    const endTime = domainException.endTime;
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;

    const now = new Date();
    const isActive = now >= startTime && now <= endTime;

    const response: AvailabilityExceptionResponse = {
      id: domainException.id as string,
      type: domainException.type,
      reason: domainException.reason,
      startTime,
      endTime,
      durationHours,
      isRecurring: domainException.isRecurring || false,
      recurringPattern: domainException.recurringPattern,
      createdAt: domainException.createdAt || new Date(),
      isActive,
    };

    return response;
  }

  private minutesToTimeSlot(
    startMinutes: number,
    endMinutes: number
  ): TimeSlotResponse {
    const format = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
    };

    return {
      startTime: format(startMinutes),
      endTime: format(endMinutes),
      durationMinutes: endMinutes - startMinutes,
    };
  }

  private getDayLabels(daysOfWeek: number[]): string[] {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek.map((day) => dayNames[day]);
  }

  private isValidityActive(
    validity: {
      startDate: Date;
      endDate?: Date | null;
    },
    now: Date
  ): boolean {
    return (
      now >= validity.startDate &&
      (!validity.endDate || now <= validity.endDate)
    );
  }

  private calculateTodayTimeSlots(
    recurringSchedule: RecurringScheduleResponse | null,
    exceptions: AvailabilityExceptionResponse[]
  ): TimeSlotResponse[] {
    if (!recurringSchedule || !recurringSchedule.isActive) {
      return [];
    }

    const today = new Date();
    const dayOfWeek = today.getDay();

    if (!recurringSchedule.dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
      return [];
    }

    let slots = [...recurringSchedule.dailyRecurrence.timeSlots];

    slots = slots.filter(
      (slot) =>
        !recurringSchedule.dailyRecurrence.excludedTimeSlots.some(
          (excluded) =>
            excluded.startTime === slot.startTime &&
            excluded.endTime === slot.endTime
        )
    );

    slots = slots.filter((slot) => {
      return !exceptions.some((exc) => {
        if (!exc.isActive) return false;
        return this.hasTimeOverlap(
          exc.startTime,
          exc.endTime,
          slot.startTime,
          slot.endTime
        );
      });
    });

    return slots;
  }

  private hasTimeOverlap(
    excStart: Date,
    excEnd: Date,
    slotStartTime: string,
    slotEndTime: string
  ): boolean {
    const excStartMinutes = excStart.getHours() * 60 + excStart.getMinutes();
    const excEndMinutes = excEnd.getHours() * 60 + excEnd.getMinutes();

    const slotStartMinutes = this.parseTime(slotStartTime);
    const slotEndMinutes = this.parseTime(slotEndTime);

    return !(
      excEndMinutes <= slotStartMinutes || excStartMinutes >= slotEndMinutes
    );
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private generateSummary(
    availabilityStatus: AvailabilityStatus,
    recurringSchedule: RecurringScheduleResponse | null,
    exceptions: AvailabilityExceptionResponse[],
    todayTimeSlots: TimeSlotResponse[]
  ): AvailabilitySummaryResponse {
    const now = new Date();

    const isCurrentlyAvailable =
      availabilityStatus === AvailabilityStatus.AVAILABLE;

    const nextAvailableTime = this.findNextAvailableTime(todayTimeSlots, now);

    const nextUnavailableTime = this.findNextUnavailableTime(exceptions);

    const totalHoursAvailableToday = todayTimeSlots.reduce(
      (sum, slot) => sum + slot.durationMinutes / 60,
      0
    );

    const scheduleStatus = this.getScheduleStatus(recurringSchedule, now);

    return {
      isCurrentlyAvailable,
      nextAvailableTime,
      nextUnavailableTime,
      totalHoursAvailableToday:
        Math.round(totalHoursAvailableToday * 100) / 100,
      activeExceptionsCount: exceptions.filter((exc) => exc.isActive).length,
      scheduleStatus,
    };
  }

  private findNextAvailableTime(
    todayTimeSlots: TimeSlotResponse[],
    now: Date
  ): Date | null {
    if (todayTimeSlots.length === 0) {
      return null;
    }

    const nextSlot = todayTimeSlots[0];
    const [hours, mins] = nextSlot.startTime.split(":").map(Number);
    const nextAvailableTime = new Date();
    nextAvailableTime.setHours(hours, mins, 0, 0);

    return nextAvailableTime < now ? null : nextAvailableTime;
  }

  private findNextUnavailableTime(
    exceptions: AvailabilityExceptionResponse[]
  ): Date | null {
    const activeExc = exceptions.find((exc) => exc.isActive);
    return activeExc ? activeExc.startTime : null;
  }

  private getScheduleStatus(
    recurringSchedule: RecurringScheduleResponse | null,
    now: Date
  ): AvailabilityStatus {
    if (!recurringSchedule) {
      return AvailabilityStatus.OFFLINE;
    }

    if (recurringSchedule.isActive) {
      return AvailabilityStatus.SCHEDULED;
    }

    if (recurringSchedule.validity.startDate > now) {
      return AvailabilityStatus.SCHEDULED;
    }

    return AvailabilityStatus.OFFLINE;
  }

  private validateInput(userId: string): { isValid: boolean; error?: string } {
    if (!userId) {
      return { isValid: false, error: "User ID is required" };
    }

    if (typeof userId !== "string") {
      return { isValid: false, error: "User ID must be a string" };
    }

    const trimmedUserId = userId.trim();
    if (trimmedUserId.length === 0) {
      return { isValid: false, error: "User ID cannot be empty" };
    }

    if (trimmedUserId.length < 3 || trimmedUserId.length > 100) {
      return {
        isValid: false,
        error: "User ID must be between 3 and 100 characters",
      };
    }

    return { isValid: true };
  }
}
