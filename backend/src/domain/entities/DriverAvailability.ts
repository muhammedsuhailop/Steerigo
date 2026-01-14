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

  static createImmediate(
    id: string,
    driverId: string,
    currentLocation: Location
  ): DriverAvailability {
    return new DriverAvailability(
      id,
      driverId,
      AvailabilityStatus.AVAILABLE,
      currentLocation,
      undefined,
      [],
      true
    );
  }

  static fromData(data: {
    id: string;
    driverId: string;
    status: AvailabilityStatus;
    currentLocation: Location;
    recurringSchedule?: RecurringScheduleData;
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

  getRecurringSchedule(): RecurringScheduleData | undefined {
    return this.recurringSchedule;
  }

  getExceptions(): AvailabilityExceptionData[] {
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

  // Status transitions

  schedule(): void {
    if (this.status === AvailabilityStatus.SCHEDULED && this.isActive) {
      return; // idempotent
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

  // Location management
  updateLocation(newLocation: Location): void {
    this.currentLocation = newLocation;
    this.updatedAt = new Date();
  }

  // Schedule management
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

  clearRecurringSchedule(): void {
    this.recurringSchedule = undefined;
    this.updatedAt = new Date();
  }

  // Exception management
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
    if (exception.startTime >= exception.endTime) {
      throw new Error("Exception start time must be before end time");
    }

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
    updates: Partial<AvailabilityExceptionData>
  ): boolean {
    const exception = this.exceptions.find((e) => e.id === exceptionId);

    if (!exception) {
      return false;
    }

    Object.assign(exception, updates);
    this.updatedAt = new Date();
    return true;
  }

  // Active state management
  activate(): void {
    if (this.isActive && this.status === AvailabilityStatus.AVAILABLE) {
      throw new Error("Driver is already active and available");
    }

    this.isActive = true;

    // Set to AVAILABLE if OFFLINE
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

  // Availability checks
  isAvailableAt(checkDate: Date): boolean {
    // Check if driver is active
    if (!this.isActive) {
      return false;
    }

    // Check exceptions first
    if (this.hasException(checkDate)) {
      return false;
    }

    // Check recurring schedule
    if (this.recurringSchedule) {
      return this.isWithinRecurringSchedule(checkDate);
    }

    return this.status === AvailabilityStatus.AVAILABLE;
  }

  isAvailableForTimeRange(startTime: Date, endTime: Date): boolean {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // sample at reasonable intervals
    const interval = 10 * 60 * 1000; // Check every 10 minutes
    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      if (!this.isAvailableAt(currentTime)) {
        return false;
      }
      currentTime = new Date(currentTime.getTime() + interval);
    }

    return true;
  }

  private isWithinRecurringSchedule(checkDate: Date): boolean {
    if (!this.recurringSchedule) {
      return false;
    }

    const { dailyRecurrence, validity } = this.recurringSchedule;

    // Check validity period
    if (checkDate < validity.startDate) {
      return false;
    }

    if (validity.endDate && checkDate > validity.endDate) {
      return false;
    }

    // Check day of week
    const dayOfWeek = checkDate.getUTCDay() as DayOfWeek;
    if (!dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
      return false;
    }

    // Check time slot
    return this.isWithinTimeSlots(checkDate, dailyRecurrence);
  }

  private isWithinTimeSlots(
    checkDate: Date,
    dailyRecurrence: DailyRecurrenceData
  ): boolean {
    const hours = checkDate.getUTCHours();
    const minutes = checkDate.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // Check if within any active time slot
    const inTimeSlot = dailyRecurrence.timeSlots.some((slot) =>
      slot.containsTime(timeInMinutes)
    );

    if (!inTimeSlot) {
      return false;
    }

    // Check if in excluded time slot
    if (dailyRecurrence.excludedTimeSlots) {
      const inExcludedSlot = dailyRecurrence.excludedTimeSlots.some((slot) =>
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
      if (checkDate >= exception.startTime && checkDate <= exception.endTime) {
        return true;
      }

      if (
        exception.isRecurring &&
        exception.recurringPattern === RecurringPattern.DAILY
      ) {
        const checkMinutes =
          checkDate.getUTCHours() * 60 + checkDate.getUTCMinutes();

        const exceptionStart = new Date(exception.startTime);
        const exceptionEnd = new Date(exception.endTime);

        const startMinutes =
          exceptionStart.getUTCHours() * 60 + exceptionStart.getUTCMinutes();

        const endMinutes =
          exceptionEnd.getUTCHours() * 60 + exceptionEnd.getUTCMinutes();

        if (checkMinutes >= startMinutes && checkMinutes <= endMinutes) {
          return true;
        }
      }

      return false;
    });
  }

  // Status transition validation
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

    return allowedTransitions[this.status]?.includes(newStatus) ?? false;
  }
}
