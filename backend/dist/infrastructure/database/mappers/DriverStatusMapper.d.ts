import { DriverStatusResponseDto } from "../../../application/dto/driver/DriverStatusResponseDto";
import { DriverAvailability } from "../../../domain/entities/DriverAvailability";
export declare class DriverStatusMapper {
    static toDtoFromEntity(availability: DriverAvailability): DriverStatusResponseDto;
    private static mapLocation;
    private static mapRecurringSchedule;
    private static mapException;
    private static isExceptionActive;
    private static buildSummary;
    private static calculateTodayTimeSlots;
    private static findNextAvailableTime;
    private static findNextUnavailableTime;
    private static determineScheduleStatus;
}
//# sourceMappingURL=DriverStatusMapper.d.ts.map