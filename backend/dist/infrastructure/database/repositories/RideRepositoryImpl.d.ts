import { IAdminRidePaginationOptions, IDailyRideStatResult, IDriverRideStatsResult, IRideFilters, IRidePaginationOptions, IRideRepository, IRiderRideStatsResult, IRideStatsResult } from "../../../domain/repositories/IRideRepository";
import { Ride } from "../../../domain/entities/Ride";
import { RideStatus } from "../../../domain/value-objects/RideStatus";
import { PaginatedResult } from "../../../shared/types/Repository";
export declare class RideRepositoryImpl implements IRideRepository {
    findById(id: string): Promise<Ride | null>;
    exists(id: string): Promise<boolean>;
    save(ride: Ride): Promise<Ride>;
    delete(id: string): Promise<void>;
    findByRideId(rideId: string): Promise<Ride | null>;
    findActiveRideByDriverId(driverId: string): Promise<Ride | null>;
    findActiveRideByRiderId(riderId: string): Promise<Ride | null>;
    findByDriverId(driverId: string, status?: RideStatus): Promise<Ride[]>;
    findByRiderId(riderId: string, status?: RideStatus): Promise<Ride[]>;
    findPaginatedByDriverId(driverId: string, options: IRidePaginationOptions): Promise<PaginatedResult<Ride>>;
    findPaginatedByRiderId(riderId: string, options: IRidePaginationOptions): Promise<PaginatedResult<Ride>>;
    findPaginatedAll(options: IAdminRidePaginationOptions): Promise<PaginatedResult<Ride>>;
    countRideStats(params: {
        driverId?: string;
        riderId?: string;
        filters: IRideFilters;
    }): Promise<IRideStatsResult>;
    countByDriverStats(driverId: string, filters: IRideFilters): Promise<IDriverRideStatsResult>;
    countByRiderStats(riderId: string, filters: IRideFilters): Promise<IRiderRideStatsResult>;
    hasTimeSlotConflict(driverId: string, pickupTime: Date, timeRequiredHours: number): Promise<boolean>;
    findLatestByRiderId(riderId: string): Promise<Ride | null>;
    getRideTimeSeriesData(params: {
        driverId?: string;
        riderId?: string;
        filters: IRideFilters;
    }): Promise<IDailyRideStatResult[]>;
}
//# sourceMappingURL=RideRepositoryImpl.d.ts.map