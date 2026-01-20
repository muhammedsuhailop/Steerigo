import { AvailabilityStatus } from "../value-objects/AvailabilityStatus";
import { Location } from "../value-objects/Location";
import { TimeSlot } from "../value-objects/TimeSlot";
import { DayOfWeek } from "../value-objects/DayOfWeek";
import {
  AvailabilityException,
  AvailabilityExceptionValidator,
} from "./AvailabilityException";

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
      true
    );
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
      data.updatedAt
    );
  }

  private static validateRecurringSchedule(
    dailyRecurrence: DailyRecurrenceData,
    validity: ScheduleValidityData
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
    updates: Partial<AvailabilityException>
  ): boolean {
    const exception = this.exceptions.find((e) => e.id === exceptionId);
    if (!exception) {
      return false;
    }

    // Validate updates before applying
    const updatedException = { ...exception, ...updates };
    AvailabilityExceptionValidator.validate(updatedException);

    Object.assign(exception, updates);
    this.updatedAt = new Date();
    return true;
  }

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

  isAvailableAt(checkDate: Date): boolean {
    // Check if driver is active
    if (!this.isActive) {
      return false;
    }

    // Check exceptions first (date-based only)
    if (this.hasDateBasedException(checkDate)) {
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

    // Check at reasonable intervals
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
}
