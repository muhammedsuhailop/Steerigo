import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { Driver } from "@domain/entities/Driver";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Ride } from "@domain/entities/Ride";
import { RideRequest } from "@domain/entities/RideRequest";
import { DriverDashboardStatistics } from "@domain/value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "@domain/value-objects/DriverDashboardPerformance";
import { User } from "@domain/entities/User";
export declare class DriverDashboardMapper {
    static toResponseDto(driver: Driver, driverUser: User, availability: DriverAvailability | null, currentRide: Ride | null, currentRideRiderUser: User | null, pendingRequests: RideRequest[], pendingRequestUsers: (User | null)[], statistics: DriverDashboardStatistics, performance: DriverDashboardPerformance, scheduledRidesCount: number): DriverDashboardResponseDto;
    private static mapDriverInfo;
    private static mapAvailability;
    private static mapCurrentRide;
    private static mapPendingRequest;
    private static calculateRideTimer;
}
//# sourceMappingURL=DriverDashboardMapper.d.ts.map