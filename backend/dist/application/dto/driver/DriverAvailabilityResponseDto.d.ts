import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";
export declare class TimeSlotDto {
    readonly startTime: number;
    readonly endTime: number;
    readonly displayStartTime: string;
    readonly displayEndTime: string;
    constructor(startTime: number, endTime: number, displayStartTime: string, displayEndTime: string);
}
export declare class DailyRecurrenceDto {
    readonly daysOfWeek: number[];
    readonly timeSlots: TimeSlotDto[];
    readonly excludedTimeSlots?: TimeSlotDto[];
    constructor(daysOfWeek: number[], timeSlots: TimeSlotDto[], excludedTimeSlots?: TimeSlotDto[]);
}
export declare class ScheduleValidityDto {
    readonly startDate: string;
    readonly endDate?: string;
    constructor(startDate: string, endDate?: string);
}
export declare class RecurringScheduleDto {
    readonly dailyRecurrence: DailyRecurrenceDto;
    readonly validity: ScheduleValidityDto;
    readonly notes?: string;
    constructor(dailyRecurrence: DailyRecurrenceDto, validity: ScheduleValidityDto, notes?: string);
}
export declare class AvailabilityExceptionDto {
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
    });
}
export declare class LocationDto {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
    constructor(latitude: number, longitude: number, address?: string);
}
export declare class DriverAvailabilityResponseDto {
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
    });
}
//# sourceMappingURL=DriverAvailabilityResponseDto.d.ts.map