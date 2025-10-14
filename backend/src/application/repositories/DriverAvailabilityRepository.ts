import { BaseRepository } from "./BaseRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { QueryOptions, FilterOptions } from "@shared/types/Repository";

export interface DriverAvailabilityFilters
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

export interface DriverAvailabilityRepository
  extends BaseRepository<DriverAvailability, string> {
  findByDriverId(driverId: string): Promise<DriverAvailability | null>;
  findActiveByDriverId(driverId: string): Promise<DriverAvailability | null>;
  existsActiveForDriver(driverId: string): Promise<boolean>;

  findByStatus(
    status: AvailabilityStatus,
    options?: QueryOptions
  ): Promise<DriverAvailability[]>;
  findAvailableDrivers(options?: QueryOptions): Promise<DriverAvailability[]>;

  findNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
    options?: QueryOptions
  ): Promise<DriverAvailability[]>;

  findExpiredAvailabilities(): Promise<DriverAvailability[]>;
  cleanupExpiredRecords(): Promise<number>;

  deactivateExpiredAvailabilities(): Promise<number>;
  findConflictingSchedule(
    driverId: string,
    availableFrom: Date,
    availableTill: Date
  ): Promise<DriverAvailability | null>;
}
