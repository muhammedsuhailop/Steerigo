import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
export interface TimeSlotResponse {
    readonly startTime: string;
    readonly endTime: string;
    readonly durationMinutes: number;
}
export interface DailyRecurrenceResponse {
    readonly daysOfWeek: number[];
    readonly timeSlots: TimeSlotResponse[];
    readonly excludedTimeSlots: TimeSlotResponse[];
    readonly daysOfWeekLabels: string[];
}
export interface ScheduleValidityResponse {
    readonly startDate: Date;
    readonly endDate: Date | null;
    readonly isCurrentlyValid: boolean;
}
export interface RecurringScheduleResponse {
    readonly dailyRecurrence: DailyRecurrenceResponse;
    readonly validity: ScheduleValidityResponse;
    readonly notes?: string;
    readonly isActive: boolean;
}
export interface AvailabilityExceptionResponse {
    readonly id: string;
    readonly type: AvailabilityExceptionType;
    readonly reason?: string;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly durationHours: number;
    readonly createdAt: Date;
}
export interface LocationResponse {
    readonly latitude: number;
    readonly longitude: number;
    readonly address?: string;
    readonly lastUpdatedAt: Date;
    readonly accuracy?: number;
}
export interface AvailabilitySummaryResponse {
    readonly isCurrentlyAvailable: boolean;
    readonly nextAvailableTime: Date | null;
    readonly nextUnavailableTime: Date | null;
    readonly totalHoursAvailableToday: number;
    readonly activeExceptionsCount: number;
    readonly scheduleStatus: AvailabilityStatus;
}
export interface DriverStatusResponseDto {
    readonly id: string;
    readonly driverId: string;
    readonly availabilityStatus: AvailabilityStatus;
    readonly currentLocation: LocationResponse;
    readonly baseLocation: LocationResponse;
    readonly lastLocationUpdateAt: Date;
    readonly recurringSchedule: RecurringScheduleResponse | null;
    readonly exceptions: AvailabilityExceptionResponse[];
    readonly activeExceptionsCount: number;
    readonly summary: AvailabilitySummaryResponse;
    readonly todayTimeSlots: TimeSlotResponse[];
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=DriverStatusResponseDto.d.ts.map