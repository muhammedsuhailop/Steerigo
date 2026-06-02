import { IDriverAvailabilityRepository, IDriverAvailabilityFilters } from "@domain/repositories/IDriverAvailabilityRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
import { AvailabilityException } from "@domain/entities/AvailabilityException";
export declare class DriverAvailabilityRepositoryImpl implements IDriverAvailabilityRepository {
    private readonly HAVERSINE_RADIUS_KM;
    private readonly AVERAGE_SPEED_KM_PER_HOUR;
    findById(id: string): Promise<DriverAvailability | null>;
    exists(id: string): Promise<boolean>;
    save(availability: DriverAvailability): Promise<DriverAvailability>;
    delete(id: string): Promise<void>;
    existsByFilter(filters: IDriverAvailabilityFilters): Promise<boolean>;
    findByIds(ids: string[]): Promise<DriverAvailability[]>;
    findAll(options?: QueryOptions): Promise<DriverAvailability[]>;
    count(filters?: IDriverAvailabilityFilters): Promise<number>;
    findPaginated(options: QueryOptions<DriverAvailability> & {
        filters?: IDriverAvailabilityFilters;
    }): Promise<PaginatedResult<DriverAvailability>>;
    findByDriverId(driverId: string): Promise<DriverAvailability | null>;
    findActiveByDriverId(driverId: string): Promise<DriverAvailability | null>;
    existsActiveForDriver(driverId: string): Promise<boolean>;
    addException(driverId: string, exception: AvailabilityException): Promise<DriverAvailability | null>;
    removeException(driverId: string, exceptionId: string): Promise<DriverAvailability | null>;
    getExceptions(driverId: string): Promise<AvailabilityException[]>;
    findByStatus(status: AvailabilityStatus, options?: QueryOptions): Promise<DriverAvailability[]>;
    findAvailableDrivers(options?: QueryOptions): Promise<DriverAvailability[]>;
    findNearLocation(latitude: number, longitude: number, radiusKm: number, options?: QueryOptions): Promise<DriverAvailability[]>;
    findNearbyAvailableDrivers(latitude: number, longitude: number, searchDate: Date, radiusKm?: number, timeRequiredMinutes?: number, limit?: number): Promise<Array<{
        driver: DriverAvailability;
        distanceKm: number;
        etaMinutes: number;
    }>>;
    findExpiredAvailabilities(): Promise<DriverAvailability[]>;
    deactivateExpiredAvailabilities(): Promise<number>;
    cleanupExpiredRecords(): Promise<number>;
    findConflictingSchedule(driverId: string, availableFrom: Date, availableTill: Date): Promise<DriverAvailability | null>;
    findNearbyAvailableDriversByBaseLocation(latitude: number, longitude: number, availableFrom: Date, radiusKm: number, limit: number): Promise<Array<{
        driver: DriverAvailability;
        driverUserId: string;
        distanceKm: number;
    }>>;
    private getDriversHandlingRideRequests;
    private toDriverAvailabilityDocument;
    private calculateEtaMinutes;
    private roundToTwoDecimals;
    private isAvailableForRequestedDuration;
    private calculateHaversineDistance;
    private buildFilterQuery;
}
//# sourceMappingURL=DriverAvailabilityRepositoryImpl.d.ts.map