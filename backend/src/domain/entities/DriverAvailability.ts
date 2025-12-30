import { AvailabilityStatus } from "../value-objects/AvailabilityStatus";
import { Location } from "../value-objects/Location";
import { TimeSlot } from "../value-objects/TimeSlot";
import { DayOfWeek } from "../value-objects/DayOfWeek";
import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";

export interface DailyRecurrenceData {
  daysOfWeek: DayOfWeek[];
  timeSlots: TimeSlot[];
  excludedTimeSlots?: TimeSlot[];
}

export interface ScheduleValidityData {
  startDate: Date;
  endDate?: Date | null;
}

export interface AvailabilityExceptionData {
  id?: string;
  type: AvailabilityExceptionType;
  reason?: string;
  startTime: Date;
  endTime: Date;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt?: Date;
}

export class DriverAvailability {
  private constructor(
    private readonly id: string,
    private readonly driverId: string,
    private status: AvailabilityStatus,
    private currentLocation: Location,
    private recurringSchedule?: {
      dailyRecurrence: DailyRecurrenceData;
      validity: ScheduleValidityData;
      notes?: string;
    },
    private exceptions: AvailabilityExceptionData[] = [],
    private isActive: boolean = true,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  static createRecurring(
    id: string,
    driverId: string,
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData,
    currentLocation: Location,
    notes?: string
  ): DriverAvailability {
    this.validateRecurringSchedule(dailyRecurrence, validity);

    const availability = new DriverAvailability(
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
      true
    );

    return availability;
  }

  static fromData(data: {
    id: string;
    driverId: string;
    status: AvailabilityStatus;
    currentLocation: Location;
    recurringSchedule?: {
      dailyRecurrence: DailyRecurrenceData;
      validity: ScheduleValidityData;
      notes?: string;
    };
    exceptions?: AvailabilityExceptionData[];
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
      data.updatedAt
    );
  }

  private static validateRecurringSchedule(
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData
  ): void {
    // Validate days of week
    if (
      !dailyRecurrence.daysOfWeek ||
      dailyRecurrence.daysOfWeek.length === 0
    ) {
      throw new Error("At least one day of week must be selected");
    }

    // Validate time slots
    if (!dailyRecurrence.timeSlots || dailyRecurrence.timeSlots.length === 0) {
      throw new Error("At least one time slot must be defined");
    }

    // Validate validity dates
    if (validity.endDate && validity.startDate >= validity.endDate) {
      throw new Error("Schedule validity end date must be after start date");
    }
  }

  // Getters
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

  getRecurringSchedule() {
    return this.recurringSchedule;
  }

  getExceptions(): AvailabilityExceptionData[] {
    return this.exceptions;
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
    notes?: string
  ): void {
    DriverAvailability.validateRecurringSchedule(dailyRecurrence, validity);

    this.recurringSchedule = {
      dailyRecurrence,
      validity,
      notes,
    };

    this.updatedAt = new Date();
  }

  addException(exception: {
    id: string;
    type: AvailabilityExceptionType;
    reason?: string;
    startTime: Date;
    endTime: Date;
    isRecurring?: boolean;
    recurringPattern?: RecurringPattern;
    createdAt?: Date;
  }): void {
    if (!this.exceptions) {
      this.exceptions = [];
    }
    this.exceptions.push(exception);
    this.updatedAt = new Date();
  }

  removeException(exceptionId: string): boolean {
    if (!this.exceptions) return false;
    const initialLength = this.exceptions.length;
    this.exceptions = this.exceptions.filter((e) => e.id !== exceptionId);
    if (this.exceptions.length < initialLength) {
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  deactivate(): void {
    this.isActive = false;
    this.status = AvailabilityStatus.OFFLINE;
    this.updatedAt = new Date();
  }

  isAvailableAt(checkDate: Date): boolean {
    // Check exceptions first
    if (this.exceptions) {
      for (const exception of this.exceptions) {
        if (
          exception.startTime <= checkDate &&
          checkDate <= exception.endTime
        ) {
          return false; // Not available due to exception
        }
      }
    }

    // Check recurring schedule
    if (this.recurringSchedule) {
      const dayOfWeek = checkDate.getDay();
      const { dailyRecurrence, validity } = this.recurringSchedule;

      if (checkDate < validity.startDate) return false;
      if (validity.endDate && checkDate > validity.endDate) return false;

      if (!dailyRecurrence.daysOfWeek.includes(dayOfWeek)) return false;

      const minutes = checkDate.getHours() * 60 + checkDate.getMinutes();
      const isInSlot = dailyRecurrence.timeSlots.some((slot) =>
        slot.containsTime(minutes)
      );

      if (!isInSlot) return false;

      const isExcluded = dailyRecurrence.excludedTimeSlots?.some((slot) =>
        slot.containsTime(minutes)
      );

      return !isExcluded;
    }

    return false;
  }

  private isWithinValidityPeriod(checkDate: Date): boolean {
    if (!this.recurringSchedule) {
      return false;
    }

    const { startDate, endDate } = this.recurringSchedule.validity;

    if (checkDate < startDate) {
      return false;
    }

    if (endDate && checkDate > endDate) {
      return false;
    }

    return true;
  }

  private isWithinTimeSlot(checkDate: Date): boolean {
    const hours = checkDate.getHours();
    const minutes = checkDate.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const { timeSlots, excludedTimeSlots } =
      this.recurringSchedule!.dailyRecurrence;

    // Check if within any active time slot
    const inTimeSlot = timeSlots.some((slot) =>
      slot.containsTime(timeInMinutes)
    );

    if (!inTimeSlot) {
      return false;
    }

    // Check if in excluded time slot
    if (excludedTimeSlots) {
      const inExcludedSlot = excludedTimeSlots.some((slot) =>
        slot.containsTime(timeInMinutes)
      );

      if (inExcludedSlot) {
        return false;
      }
    }

    return true;
  }

  private hasException(checkDate: Date): boolean {
    return this.exceptions.some((exception) => {
      // Check if current date/time falls within exception range
      if (checkDate >= exception.startTime && checkDate <= exception.endTime) {
        return true;
      }

      // Handle recurring exceptions
      if (
        exception.isRecurring &&
        exception.recurringPattern === RecurringPattern.DAILY
      ) {
        const exceptionStart = new Date(exception.startTime);
        const exceptionEnd = new Date(exception.endTime);

        // Check if same time range on any day
        if (
          checkDate.getHours() === exceptionStart.getHours() &&
          checkDate.getMinutes() >= exceptionStart.getMinutes() &&
          checkDate.getHours() === exceptionEnd.getHours() &&
          checkDate.getMinutes() <= exceptionEnd.getMinutes()
        ) {
          return true;
        }
      }

      return false;
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
        ],
        [AvailabilityStatus.BUSY]: [
          AvailabilityStatus.AVAILABLE,
          AvailabilityStatus.OFFLINE,
        ],
        [AvailabilityStatus.SCHEDULED]: [
          AvailabilityStatus.AVAILABLE,
          AvailabilityStatus.BUSY,
          AvailabilityStatus.OFFLINE,
        ],
      };

    return allowedTransitions[this.status]?.includes(newStatus) ?? false;
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
    this.updatedAt = new Date();
  }

  private generateExceptionId(): string {
    return `exc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
