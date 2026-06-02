import { DayOfWeek } from "../../../domain/value-objects/DayOfWeek";
import { TimeSlot } from "../../../domain/value-objects/TimeSlot";
export declare class ScheduleRecurringAvailabilityRequestDto {
    private readonly userId;
    private readonly data;
    constructor(userId: string, requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): ScheduleRecurringAvailabilityRequestDto;
    getUserId(): string;
    getDaysOfWeek(): DayOfWeek[];
    getTimeSlots(): TimeSlot[];
    getExcludedTimeSlots(): TimeSlot[];
    getValidityStartDate(): Date;
    getValidityEndDate(): Date | null;
    getNotes(): string | undefined;
    getLocationData(): {
        latitude: number;
        longitude: number;
        address?: string;
    };
    validate(): string[];
    private timeSlotsOverlap;
}
//# sourceMappingURL=ScheduleRecurringAvailabilityRequestDto.d.ts.map