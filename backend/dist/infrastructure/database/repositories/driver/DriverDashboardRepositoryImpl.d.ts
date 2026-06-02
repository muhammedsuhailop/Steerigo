import { IDriverDashboardRepository } from "@domain/repositories/IDriverDashboardRepository";
import { Ride } from "@domain/entities/Ride";
import { RideRequest } from "@domain/entities/RideRequest";
import { DriverDashboardStatistics } from "@domain/value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "@domain/value-objects/DriverDashboardPerformance";
export declare class DriverDashboardRepositoryImpl implements IDriverDashboardRepository {
    private parseRideType;
    getDashboardData(driverId: string): Promise<{
        currentRide: Ride | null;
        pendingRequests: RideRequest[];
        statistics: DriverDashboardStatistics;
        performance: DriverDashboardPerformance;
        scheduledRidesCount: number;
    }>;
    private getStatistics;
    private getPerformance;
    private getCurrentRide;
    private getPendingRequests;
    private getScheduledRidesCount;
    private mapDocumentToRide;
    private mapDocumentToRideRequest;
}
//# sourceMappingURL=DriverDashboardRepositoryImpl.d.ts.map