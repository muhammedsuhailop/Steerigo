import { PaginatedResult } from "@shared/types/Repository";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { Ride } from "@domain/entities/Ride";
import { RideStatus } from "@domain/value-objects/RideStatus";

export interface IRideFilters {
  status?: RideStatus;
  fromDate?: Date;
  toDate?: Date;
}

export interface IRidePaginationOptions extends IRideFilters {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface IAdminRidePaginationOptions extends IRidePaginationOptions {
  riderId?: string;
  driverId?: string;
}

export interface IRideRepository
  extends IReadOnlyRepository<Ride, string>,
    IWriteOnlyRepository<Ride, string> {
  findByRideId(rideId: string): Promise<Ride | null>;

  findActiveRideByDriverId(driverId: string): Promise<Ride | null>;

  findActiveRideByRiderId(riderId: string): Promise<Ride | null>;

  findByDriverId(driverId: string, status?: RideStatus): Promise<Ride[]>;

  findByRiderId(riderId: string, status?: RideStatus): Promise<Ride[]>;
  findPaginatedByDriverId(
    driverId: string,
    options: IRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>>;
  findPaginatedByRiderId(
    riderId: string,
    options: IRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>>;
  findPaginatedAll(
    options: IAdminRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>>;
}
