import { AvailabilityStatus } from "../value-objects/AvailabilityStatus";
import { Location } from "../value-objects/Location";
import { TimeSlot } from "../value-objects/TimeSlot";
import { DayOfWeek } from "../value-objects/DayOfWeek";
import { AvailabilityException } from "./AvailabilityException";
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
export declare class DriverAvailability {
    private readonly id;
    private readonly driverId;
    private status;
    private currentLocation;
    private baseLocation?;
    private recurringSchedule?;
    private exceptions;
    private isActive;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static createRecurring(id: string, driverId: string, dailyRecurrence: DailyRecurrenceData, validity: ScheduleValidityData, currentLocation: Location, baseLocation?: Location, notes?: string): DriverAvailability;
    static createImmediate(id: string, driverId: string, currentLocation: Location, baseLocation?: Location): DriverAvailability;
    static fromData(data: {
        id: string;
        driverId: string;
        status: AvailabilityStatus;
        currentLocation: Location;
        baseLocation?: Location;
        recurringSchedule?: RecurringScheduleData;
        exceptions?: AvailabilityException[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): DriverAvailability;
    private static validateRecurringSchedule;
    getId(): string;
    getDriverId(): string;
    getStatus(): AvailabilityStatus;
    getCurrentLocation(): Location;
    getBaseLocation(): Location | undefined;
    getRecurringSchedule(): RecurringScheduleData | undefined;
    getExceptions(): AvailabilityException[];
    getIsActive(): boolean;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    schedule(): void;
    updateStatus(newStatus: AvailabilityStatus): void;
    updateLocation(newLocation: Location): void;
    updateBaseLocation(newLocation: Location): void;
    updateRecurringSchedule(dailyRecurrence: DailyRecurrenceData, validity: ScheduleValidityData, notes?: string): void;
    clearRecurringSchedule(): void;
    addException(exception: AvailabilityException): void;
    removeException(exceptionId: string): boolean;
    updateException(exceptionId: string, updates: Partial<AvailabilityException>): boolean;
    activate(): void;
    deactivate(): void;
    isAvailableAt(checkDate: Date): boolean;
    isAvailableForTimeRange(startTime: Date, endTime: Date): boolean;
    private isRangeWithinRecurringSchedule;
    private isDayRangeCoveredBySlots;
    private isWithinRecurringSchedule;
    private isWithinTimeSlots;
    private hasDateBasedException;
    private canTransitionTo;
    private normalizeRange;
}
//# sourceMappingURL=DriverAvailability.d.ts.map