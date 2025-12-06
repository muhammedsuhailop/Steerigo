import { Ride } from "@domain/entities/Ride";
import { RideRequest } from "@domain/entities/RideRequest";
import { DriverDashboardStatistics } from "@domain/value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "@domain/value-objects/DriverDashboardPerformance";

export interface IDriverDashboardRepository {
  getDashboardData(driverId: string): Promise<{
    currentRide: Ride | null;
    pendingRequests: RideRequest[];
    statistics: DriverDashboardStatistics;
    performance: DriverDashboardPerformance;
    scheduledRidesCount: number;
  }>;
}
