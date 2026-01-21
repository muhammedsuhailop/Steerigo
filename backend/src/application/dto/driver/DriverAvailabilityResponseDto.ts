import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";

export class TimeSlotDto {
  readonly startTime: number;
  readonly endTime: number;
  readonly displayStartTime: string;
  readonly displayEndTime: string;

  constructor(
    startTime: number,
    endTime: number,
    displayStartTime: string,
    displayEndTime: string
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.displayStartTime = displayStartTime;
    this.displayEndTime = displayEndTime;
  }
}

export class DailyRecurrenceDto {
  readonly daysOfWeek: number[];
  readonly timeSlots: TimeSlotDto[];
  readonly excludedTimeSlots?: TimeSlotDto[];

  constructor(
    daysOfWeek: number[],
    timeSlots: TimeSlotDto[],
    excludedTimeSlots?: TimeSlotDto[]
  ) {
    this.daysOfWeek = daysOfWeek;
    this.timeSlots = timeSlots;
    this.excludedTimeSlots = excludedTimeSlots;
  }
}

export class ScheduleValidityDto {
  readonly startDate: string;
  readonly endDate?: string;

  constructor(startDate: string, endDate?: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class RecurringScheduleDto {
  readonly dailyRecurrence: DailyRecurrenceDto;
  readonly validity: ScheduleValidityDto;
  readonly notes?: string;

  constructor(
    dailyRecurrence: DailyRecurrenceDto,
    validity: ScheduleValidityDto,
    notes?: string
  ) {
    this.dailyRecurrence = dailyRecurrence;
    this.validity = validity;
    this.notes = notes;
  }
}

export class AvailabilityExceptionDto {
  readonly id?: string;
  readonly type: AvailabilityExceptionType;
  readonly reason?: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly isRecurring?: boolean;
  readonly recurringPattern?: RecurringPattern;
  readonly createdAt?: string;

  constructor(params: {
    id?: string;
    type: AvailabilityExceptionType;
    reason?: string;
    startTime: string;
    endTime: string;
    isRecurring?: boolean;
    recurringPattern?: RecurringPattern;
    createdAt?: string;
  }) {
    this.id = params.id;
    this.type = params.type;
    this.reason = params.reason;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.isRecurring = params.isRecurring;
    this.recurringPattern = params.recurringPattern;
    this.createdAt = params.createdAt;
  }
}

export class LocationDto {
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;

  constructor(latitude: number, longitude: number, address?: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
  }
}

export class DriverAvailabilityResponseDto {
  readonly id: string;
  readonly driverId: string;
  readonly status: string;
  readonly currentLocation: LocationDto;
  readonly recurringSchedule?: RecurringScheduleDto;
  readonly exceptions: AvailabilityExceptionDto[];
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(params: {
    id: string;
    driverId: string;
    status: string;
    currentLocation: LocationDto;
    recurringSchedule?: RecurringScheduleDto;
    exceptions: AvailabilityExceptionDto[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.driverId = params.driverId;
    this.status = params.status;
    this.currentLocation = params.currentLocation;
    this.recurringSchedule = params.recurringSchedule;
    this.exceptions = params.exceptions;
    this.isActive = params.isActive;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

