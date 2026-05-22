import {
  TimeSlotResponse,
  RecurringScheduleResponse,
  AvailabilityExceptionResponse,
  LocationResponse,
  AvailabilitySummaryResponse,
  DriverStatusResponseDto,
} from "@application/dto/driver/DriverStatusResponseDto";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Location } from "@domain/value-objects/Location";
import { TimeSlot } from "@domain/value-objects/TimeSlot";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { TimeSlotHelper } from "@shared/utils/TimeSlotHelper";
import { ScheduleValidityHelper } from "@shared/utils/ScheduleValidityHelper";
import { AvailabilityException } from "@domain/entities/AvailabilityException";

export class DriverStatusMapper {
  static toDtoFromEntity(
    availability: DriverAvailability,
  ): DriverStatusResponseDto {
    const recurringSchedule =
      this.mapRecurringSchedule(availability.getRecurringSchedule()) ?? null;

    return {
      id: availability.getId(),
      driverId: availability.getDriverId(),
      availabilityStatus: availability.getStatus(),
      currentLocation: this.mapLocation(availability.getCurrentLocation()),
      baseLocation: this.mapLocation(
        availability.getBaseLocation() ?? availability.getCurrentLocation(),
      ),
      lastLocationUpdateAt: new Date(),
      recurringSchedule,
      exceptions: availability
        .getExceptions()
        .map((exc) => this.mapException(exc)),
      activeExceptionsCount: availability
        .getExceptions()
        .filter((exc) => this.isExceptionActive(exc)).length,
      summary: this.buildSummary(
        availability.getStatus(),
        availability.getExceptions(),
        availability.getRecurringSchedule(),
      ),
      todayTimeSlots: this.calculateTodayTimeSlots(
        availability.getExceptions(),
        availability.getRecurringSchedule(),
      ),
      isActive: availability.getIsActive(),
      createdAt: availability.getCreatedAt(),
      updatedAt: availability.getUpdatedAt(),
    };
  }

  private static mapLocation(domainLocation: Location): LocationResponse {
    const coordinates = domainLocation.getCoordinates();
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      address: coordinates.address,
      lastUpdatedAt: new Date(),
      accuracy: 10,
    };
  }

  private static mapRecurringSchedule(
    domainSchedule?: ReturnType<DriverAvailability["getRecurringSchedule"]>,
  ): RecurringScheduleResponse | undefined {
    if (!domainSchedule) return undefined;

    const { dailyRecurrence, validity } = domainSchedule;

    const timeSlots = dailyRecurrence.timeSlots.map((slot: TimeSlot) =>
      TimeSlotHelper.minutesToTimeSlot(slot.getStartTime(), slot.getEndTime()),
    );

    const excludedTimeSlots = (dailyRecurrence.excludedTimeSlots ?? []).map(
      (slot: TimeSlot) =>
        TimeSlotHelper.minutesToTimeSlot(
          slot.getStartTime(),
          slot.getEndTime(),
        ),
    );

    const daysOfWeek = dailyRecurrence.daysOfWeek;
    const daysOfWeekLabels = TimeSlotHelper.getDayLabels(daysOfWeek);

    const isCurrentlyValid = ScheduleValidityHelper.isValidityActive(
      validity,
      new Date(),
    );

    return {
      dailyRecurrence: {
        daysOfWeek,
        timeSlots,
        excludedTimeSlots,
        daysOfWeekLabels,
      },
      validity: {
        startDate: validity.startDate,
        endDate: validity.endDate ?? null,
        isCurrentlyValid,
      },
      notes: domainSchedule.notes,
      isActive: isCurrentlyValid,
    };
  }

  private static mapException(
    domainException: AvailabilityException,
  ): AvailabilityExceptionResponse {
    const startTime = domainException.startTime;
    const endTime = domainException.endTime;

    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.round((durationMs / 36e5) * 10) / 10;

    return {
      id: domainException.id as string,
      type: domainException.type,
      reason: domainException.reason,
      startTime,
      endTime,
      durationHours,
      createdAt: domainException.createdAt ?? new Date(),
    };
  }

  private static isExceptionActive(exception: AvailabilityException): boolean {
    const now = new Date();
    return now >= exception.startTime && now <= exception.endTime;
  }

  private static buildSummary(
    availabilityStatus: AvailabilityStatus,
    exceptions: AvailabilityException[],
    domainSchedule?: ReturnType<DriverAvailability["getRecurringSchedule"]>,
  ): AvailabilitySummaryResponse {
    const now = new Date();

    const recurringSchedule = this.mapRecurringSchedule(domainSchedule);
    const mappedExceptions = exceptions.map((exc) => this.mapException(exc));
    const todayTimeSlots = this.calculateTodayTimeSlots(
      exceptions,
      domainSchedule,
    );

    return {
      isCurrentlyAvailable: availabilityStatus === AvailabilityStatus.AVAILABLE,
      nextAvailableTime: this.findNextAvailableTime(todayTimeSlots, now),
      nextUnavailableTime: this.findNextUnavailableTime(mappedExceptions),
      totalHoursAvailableToday: todayTimeSlots.reduce(
        (sum, slot) => sum + slot.durationMinutes / 60,
        0,
      ),
      activeExceptionsCount: mappedExceptions.filter((exc) => exc).length,
      scheduleStatus: this.determineScheduleStatus(recurringSchedule, now),
    };
  }

  private static calculateTodayTimeSlots(
    exceptions: AvailabilityException[],
    domainSchedule?: ReturnType<DriverAvailability["getRecurringSchedule"]>,
  ): TimeSlotResponse[] {
    const recurringSchedule = this.mapRecurringSchedule(domainSchedule);

    if (!recurringSchedule?.isActive) return [];

    const dayOfWeek = ScheduleValidityHelper.getTodayDayOfWeek();
    if (!recurringSchedule.dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
      return [];
    }

    let slots = [...recurringSchedule.dailyRecurrence.timeSlots];

    slots = slots.filter(
      (slot) =>
        !recurringSchedule.dailyRecurrence.excludedTimeSlots.some(
          (excluded) =>
            excluded.startTime === slot.startTime &&
            excluded.endTime === slot.endTime,
        ),
    );

    const mappedExceptions = exceptions.map((exc) => this.mapException(exc));

    return slots.filter(
      (slot) =>
        !mappedExceptions.some(
          (exc) =>
            exc &&
            TimeSlotHelper.hasTimeOverlap(
              exc.startTime,
              exc.endTime,
              slot.startTime,
              slot.endTime,
            ),
        ),
    );
  }

  private static findNextAvailableTime(
    todayTimeSlots: TimeSlotResponse[],
    now: Date,
  ): Date | null {
    if (todayTimeSlots.length === 0) return null;

    const [hours, mins] = todayTimeSlots[0].startTime.split(":").map(Number);

    const next = new Date();
    next.setHours(hours, mins, 0, 0);

    return next < now ? null : next;
  }

  private static findNextUnavailableTime(
    exceptions: AvailabilityExceptionResponse[],
  ): Date | null {
    const active = exceptions.find((exc) => exc);
    return active?.startTime ?? null;
  }

  private static determineScheduleStatus(
    recurringSchedule: RecurringScheduleResponse | undefined,
    now: Date,
  ): AvailabilityStatus {
    if (!recurringSchedule) return AvailabilityStatus.OFFLINE;

    if (recurringSchedule.isActive) {
      return AvailabilityStatus.SCHEDULED;
    }

    if (
      ScheduleValidityHelper.isSchedulePending(
        recurringSchedule.validity.startDate,
        now,
      )
    ) {
      return AvailabilityStatus.SCHEDULED;
    }

    return AvailabilityStatus.OFFLINE;
  }
}
