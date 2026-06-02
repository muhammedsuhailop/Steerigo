import { Ride } from "../entities/Ride";
import { RideRequest } from "../entities/RideRequest";
import { DriverDashboardStatistics } from "../value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "../value-objects/DriverDashboardPerformance";
export interface IDriverDashboardRepository {
    getDashboardData(driverId: string): Promise<{
        currentRide: Ride | null;
        pendingRequests: RideRequest[];
        statistics: DriverDashboardStatistics;
        performance: DriverDashboardPerformance;
        scheduledRidesCount: number;
    }>;
}
//# sourceMappingURL=IDriverDashboardRepository.d.ts.map