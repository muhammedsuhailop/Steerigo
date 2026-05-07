import { AvailabilityStatus } from "../value-objects/AvailabilityStatus";
import { Location } from "../value-objects/Location";
import { TimeSlot } from "../value-objects/TimeSlot";
import { DayOfWeek } from "../value-objects/DayOfWeek";
import {
  AvailabilityException,
  AvailabilityExceptionValidator,
} from "./AvailabilityException";
import { Logger } from "@shared/utils/Logger";

export interface DailyRecurrenceData {
  daysOfWeek: DayOfWeek[];
  timeSlots: TimeSlot[];
  excludedTimeSlots?: TimeSlot[];
}

export interface ScheduleValidityData {
  startDate: Date;
  endDate?: Date | null;
}

export interface RecurringScheduleData {
  dailyRecurrence: DailyRecurrenceData;
  validity: ScheduleValidityData;
  notes?: string;
}

export class DriverAvailability {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private status: AvailabilityStatus,
    private currentLocation: Location,
    private recurringSchedule?: RecurringScheduleData,
    private exceptions: AvailabilityException[] = [],
    private isActive: boolean = true,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static createRecurring(
    id: string,
    driverId: string,
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData,
    currentLocation: Location,
    notes?: string,
  ): DriverAvailability {
    this.validateRecurringSchedule(dailyRecurrence, validity);
    return new DriverAvailability(
      id,
      driverId,
      AvailabilityStatus.SCHEDULED,
      currentLocation,
      {
        dailyRecurrence,
        validity,
        notes,
      },
      [],
      true,
    );
  }

  static createImmediate(
    id: string,
    driverId: string,
    currentLocation: Location,
  ): DriverAvailability {
    return new DriverAvailability(
      id,
      driverId,
      AvailabilityStatus.AVAILABLE,
      currentLocation,
      undefined,
      [],
      true,
    );
  }

  static fromData(data: {
    id: string;
    driverId: string;
    status: AvailabilityStatus;
    currentLocation: Location;
    recurringSchedule?: RecurringScheduleData;
    exceptions?: AvailabilityException[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): DriverAvailability {
    return new DriverAvailability(
      data.id,
      data.driverId,
      data.status,
      data.currentLocation,
      data.recurringSchedule,
      data.exceptions || [],
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }

  private static validateRecurringSchedule(
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData,
  ): void {
    if (
      !dailyRecurrence.daysOfWeek ||
      dailyRecurrence.daysOfWeek.length === 0
    ) {
      throw new Error("At least one day of week must be selected");
    }

    if (!dailyRecurrence.timeSlots || dailyRecurrence.timeSlots.length === 0) {
      throw new Error("At least one time slot must be defined");
    }

    if (validity.endDate && validity.startDate >= validity.endDate) {
      throw new Error("Schedule validity end date must be after start date");
    }
  }

  getId(): string {
    return this.id;
  }

  getDriverId(): string {
    return this.driverId;
  }

  getStatus(): AvailabilityStatus {
    return this.status;
  }

  getCurrentLocation(): Location {
    return this.currentLocation;
  }

  getRecurringSchedule(): RecurringScheduleData | undefined {
    return this.recurringSchedule;
  }

  getExceptions(): AvailabilityException[] {
    return [...this.exceptions];
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  schedule(): void {
    if (this.status === AvailabilityStatus.SCHEDULED && this.isActive) {
      return;
    }

    if (!this.canTransitionTo(AvailabilityStatus.SCHEDULED)) {
      throw new Error(`Cannot transition from ${this.status} to SCHEDULED`);
    }

    this.status = AvailabilityStatus.SCHEDULED;
    this.isActive = true;
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: AvailabilityStatus): void {
    if (this.status === newStatus) {
      throw new Error(`Driver is already ${newStatus}`);
    }

    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  updateLocation(newLocation: Location): void {
    this.currentLocation = newLocation;
    this.updatedAt = new Date();
  }

  updateRecurringSchedule(
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData,
    notes?: string,
  ): void {
    DriverAvailability.validateRecurringSchedule(dailyRecurrence, validity);
    this.recurringSchedule = {
      dailyRecurrence,
      validity,
      notes,
    };
    this.updatedAt = new Date();
  }

  clearRecurringSchedule(): void {
    this.recurringSchedule = undefined;
    this.updatedAt = new Date();
  }

  addException(exception: AvailabilityException): void {
    AvailabilityExceptionValidator.validate(exception);
    this.exceptions.push(exception);
    this.updatedAt = new Date();
  }

  removeException(exceptionId: string): boolean {
    const initialLength = this.exceptions.length;
    this.exceptions = this.exceptions.filter((e) => e.id !== exceptionId);

    if (this.exceptions.length < initialLength) {
      this.updatedAt = new Date();
      return true;
    }

    return false;
  }

  updateException(
    exceptionId: string,
    updates: Partial<AvailabilityException>,
  ): boolean {
    const exception = this.exceptions.find((e) => e.id === exceptionId);
    if (!exception) {
      return false;
    }

    const updatedException = { ...exception, ...updates };
    AvailabilityExceptionValidator.validate(updatedException);

    Object.assign(exception, updates);
    this.updatedAt = new Date();
    return true;
  }

  activate(): void {
    this.isActive = true;

    if (this.status === AvailabilityStatus.OFFLINE) {
      this.status = AvailabilityStatus.AVAILABLE;
    }

    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.status = AvailabilityStatus.OFFLINE;
    this.updatedAt = new Date();
  }

  isAvailableAt(checkDate: Date): boolean {
    if (!this.isActive) {
      return false;
    }

    if (this.hasDateBasedException(checkDate)) {
      return false;
    }

    if (this.recurringSchedule) {
      return this.isWithinRecurringSchedule(checkDate);
    }

    return this.status === AvailabilityStatus.AVAILABLE;
  }

  isAvailableForTimeRange(startTime: Date, endTime: Date): boolean {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    if (!this.isActive) {
      Logger.debug("Availability Trace: Driver is not active", {
        driverId: this.driverId,
      });
      return false;
    }

    for (const exception of this.exceptions) {
      if (exception.startTime < endTime && exception.endTime > startTime) {
        Logger.debug("Availability Trace: Overlap with manual exception", {
          driverId: this.driverId,
          exception,
        });
        return false;
      }
    }

    if (this.recurringSchedule) {
      return this.isRangeWithinRecurringSchedule(startTime, endTime);
    }

    const isAvailable = this.status === AvailabilityStatus.AVAILABLE;
    if (!isAvailable) {
      Logger.debug(
        "Availability Trace: Missing recurring schedule and status not AVAILABLE",
        { driverId: this.driverId, status: this.status },
      );
    }

    return isAvailable;
  }

  private isRangeWithinRecurringSchedule(
    startTime: Date,
    endTime: Date,
  ): boolean {
    const { dailyRecurrence, validity } = this.recurringSchedule!;

    if (startTime < validity.startDate) {
      Logger.debug(
        "Availability Trace: Request is before schedule validity start date",
        { driverId: this.driverId, validityStart: validity.startDate },
      );
      return false;
    }
    if (validity.endDate && endTime > validity.endDate) {
      Logger.debug(
        "Availability Trace: Request is after schedule validity end date",
        { driverId: this.driverId, validityEnd: validity.endDate },
      );
      return false;
    }

    const currentDate = new Date(startTime);
    currentDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(endTime);
    endDate.setUTCHours(23, 59, 59, 999);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getUTCDay() as DayOfWeek;

      if (dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
        let dayRangeStart = new Date(currentDate);
        let dayRangeEnd = new Date(currentDate);
        dayRangeEnd.setUTCHours(23, 59, 59, 999);

        if (startTime > dayRangeStart) {
          dayRangeStart = new Date(startTime);
        }
        if (endTime < dayRangeEnd) {
          dayRangeEnd = new Date(endTime);
        }

        if (
          !this.isDayRangeCoveredBySlots(
            dayRangeStart,
            dayRangeEnd,
            dailyRecurrence,
          )
        ) {
          Logger.debug(
            "Availability Trace: Time slot coverage failed for day",
            { driverId: this.driverId, dayOfWeek, dayRangeStart, dayRangeEnd },
          );
          return false;
        }
      } else {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setUTCHours(23, 59, 59, 999);

        if (startTime < dayEnd && endTime > dayStart) {
          Logger.debug(
            "Availability Trace: Day of week not in driver's recurrence",
            {
              driverId: this.driverId,
              dayOfWeek,
              allowedDays: dailyRecurrence.daysOfWeek,
            },
          );
          return false;
        }
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      currentDate.setUTCHours(0, 0, 0, 0);
    }

    return true;
  }

  private isDayRangeCoveredBySlots(
    dayRangeStart: Date,
    dayRangeEnd: Date,
    dailyRecurrence: DailyRecurrenceData,
  ): boolean {
    const startMinutes =
      dayRangeStart.getUTCHours() * 60 + dayRangeStart.getUTCMinutes();
    const endMinutes =
      dayRangeEnd.getUTCHours() * 60 + dayRangeEnd.getUTCMinutes();

    const queryRanges = this.normalizeRange(startMinutes, endMinutes);

    for (const [qStart, qEnd] of queryRanges) {
      let covered = false;

      for (const slot of dailyRecurrence.timeSlots) {
        const slotRanges = this.normalizeRange(
          slot.getStartTime(),
          slot.getEndTime(),
        );

        if (
          slotRanges.some(([sStart, sEnd]) => qStart >= sStart && qEnd <= sEnd)
        ) {
          covered = true;
          break;
        }
      }

      if (!covered) {
        Logger.debug(
          "Availability Trace: Minutes range not covered by any time slot",
          {
            driverId: this.driverId,
            requestedMinutes: { qStart, qEnd },
            availableSlots: dailyRecurrence.timeSlots.map((s) => ({
              start: s.getStartTime(),
              end: s.getEndTime(),
            })),
          },
        );
        return false;
      }
    }

    if (dailyRecurrence.excludedTimeSlots?.length) {
      for (const ex of dailyRecurrence.excludedTimeSlots) {
        const exRanges = this.normalizeRange(
          ex.getStartTime(),
          ex.getEndTime(),
        );

        for (const [qStart, qEnd] of queryRanges) {
          if (
            exRanges.some(([eStart, eEnd]) => qStart < eEnd && eStart < qEnd)
          ) {
            Logger.debug("Availability Trace: Hit an excluded time slot", {
              driverId: this.driverId,
              excludedSlot: ex,
            });
            return false;
          }
        }
      }
    }

    return true;
  }

  private isWithinRecurringSchedule(checkDate: Date): boolean {
    if (!this.recurringSchedule) {
      return false;
    }

    const { dailyRecurrence, validity } = this.recurringSchedule;

    if (checkDate < validity.startDate) {
      return false;
    }

    if (validity.endDate && checkDate > validity.endDate) {
      return false;
    }

    const dayOfWeek = checkDate.getUTCDay() as DayOfWeek;
    if (!dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
      return false;
    }

    return this.isWithinTimeSlots(checkDate, dailyRecurrence);
  }

  private isWithinTimeSlots(
    checkDate: Date,
    dailyRecurrence: DailyRecurrenceData,
  ): boolean {
    const hours = checkDate.getUTCHours();
    const minutes = checkDate.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const inTimeSlot = dailyRecurrence.timeSlots.some((slot) =>
      slot.containsTime(timeInMinutes),
    );

    if (!inTimeSlot) {
      return false;
    }

    if (dailyRecurrence.excludedTimeSlots) {
      const inExcludedSlot = dailyRecurrence.excludedTimeSlots.some((slot) =>
        slot.containsTime(timeInMinutes),
      );

      if (inExcludedSlot) {
        return false;
      }
    }

    return true;
  }

  private hasDateBasedException(checkDate: Date): boolean {
    return this.exceptions.some((exception) => {
      return checkDate >= exception.startTime && checkDate <= exception.endTime;
    });
  }
  private canTransitionTo(newStatus: AvailabilityStatus): boolean {
    const allowedTransitions: Record<AvailabilityStatus, AvailabilityStatus[]> =
      {
        [AvailabilityStatus.OFFLINE]: [
          AvailabilityStatus.AVAILABLE,
          AvailabilityStatus.SCHEDULED,
        ],
        [AvailabilityStatus.AVAILABLE]: [
          AvailabilityStatus.BUSY,
          AvailabilityStatus.OFFLINE,
          AvailabilityStatus.SCHEDULED,
        ],
        [AvailabilityStatus.BUSY]: [
          AvailabilityStatus.AVAILABLE,
          AvailabilityStatus.OFFLINE,
          AvailabilityStatus.SCHEDULED,
        ],
        [AvailabilityStatus.SCHEDULED]: [
          AvailabilityStatus.AVAILABLE,
          AvailabilityStatus.BUSY,
          AvailabilityStatus.OFFLINE,
        ],
      };

    return allowedTransitions[this.status].includes(newStatus);
  }

  private normalizeRange(start: number, end: number): [number, number][] {
    if (start <= end) {
      return [[start, end]];
    }
    return [
      [start, 1440],
      [0, end],
    ];
  }
}
