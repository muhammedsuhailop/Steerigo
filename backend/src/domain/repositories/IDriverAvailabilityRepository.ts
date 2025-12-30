import { IBaseRepository } from "./IBaseRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { QueryOptions, FilterOptions } from "@shared/types/Repository";

export interface IDriverAvailabilityFilters
  extends FilterOptions<DriverAvailability> {
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

export interface IDriverAvailabilityRepository
  extends IBaseRepository<DriverAvailability, string> {
  // Driver-specific queries
  findByDriverId(driverId: string): Promise<DriverAvailability | null>;
  findActiveByDriverId(driverId: string): Promise<DriverAvailability | null>;
  existsActiveForDriver(driverId: string): Promise<boolean>;

  addException(driverId: string, exception: any): Promise<DriverAvailability>;
  removeException(driverId: string, exceptionId: string): Promise<boolean>;
  getExceptions(driverId: string): Promise<any[]>;

  // Status-based queries
  findByStatus(
    status: AvailabilityStatus,
    options?: QueryOptions
  ): Promise<DriverAvailability[]>;
  findAvailableDrivers(options?: QueryOptions): Promise<DriverAvailability[]>;

  // Location-based queries
  findNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
    options?: QueryOptions
  ): Promise<DriverAvailability[]>;

  findNearbyAvailableDrivers(
    latitude: number,
    longitude: number,
    searchDate: Date,
    radiusKm?: number,
    timeRequiredMinutes?: number,
    limit?: number
  ): Promise<
    Array<{
      driver: DriverAvailability;
      distanceKm: number;
      etaMinutes: number;
    }>
  >;

  // Time-based queries
  findExpiredAvailabilities(): Promise<DriverAvailability[]>;
  cleanupExpiredRecords(): Promise<number>;
  deactivateExpiredAvailabilities(): Promise<number>;

  // Schedule management
  findConflictingSchedule(
    driverId: string,
    availableFrom: Date,
    availableTill: Date
  ): Promise<DriverAvailability | null>;
}
