import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { QueryOptions, FilterOptions } from "@shared/types/Repository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
import { AvailabilityException } from "@domain/entities/AvailabilityException";
export interface IDriverAvailabilityFilters extends FilterOptions<DriverAvailability> {
    status?: AvailabilityStatus;
    driverId?: string;
    availableFrom?: Date;
    availableTill?: Date;
    nearLocation?: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
    };
}
export interface IDriverAvailabilityRepository extends IWriteOnlyRepository<DriverAvailability, string>, IQueryableRepository<DriverAvailability, string> {
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
    cleanupExpiredRecords(): Promise<number>;
    deactivateExpiredAvailabilities(): Promise<number>;
    findConflictingSchedule(driverId: string, availableFrom: Date, availableTill: Date): Promise<DriverAvailability | null>;
    findNearbyAvailableDriversByBaseLocation(latitude: number, longitude: number, availableFrom: Date, radiusKm: number, limit: number): Promise<Array<{
        driver: DriverAvailability;
        driverUserId: string;
        distanceKm: number;
    }>>;
}
//# sourceMappingURL=IDriverAvailabilityRepository.d.ts.map