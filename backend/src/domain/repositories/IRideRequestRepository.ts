import { IBaseRepository } from "./IBaseRepository";
import { RideRequest } from "@domain/entities/RideRequest";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { QueryOptions, FilterOptions } from "@shared/types/Repository";

export interface IRideRequestFilters extends FilterOptions<RideRequest> {
  status?: RideRequestStatus;
  driverId?: string;
  riderId?: string;
  pickupTimeFrom?: Date;
  pickupTimeTo?: Date;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface IRideRequestRepository
  extends IBaseRepository<RideRequest, string> {
  // Driver-specific queries
  findByDriverId(
    driverId: string,
    options?: QueryOptions
  ): Promise<RideRequest[]>;
  findPendingByDriverId(driverId: string): Promise<RideRequest[]>;
  countPendingByDriverId(driverId: string): Promise<number>;

  // Rider-specific queries
  findByRiderId(
    riderId: string,
    options?: QueryOptions
  ): Promise<RideRequest[]>;
  findPendingByRiderId(riderId: string): Promise<RideRequest[]>;

  // Status-based queries
  findByStatus(
    status: RideRequestStatus,
    options?: QueryOptions
  ): Promise<RideRequest[]>;
  findExpiredRequests(): Promise<RideRequest[]>;

  // Specialized operations
  findByRequestId(requestId: string): Promise<RideRequest | null>;
  expirePendingRequests(olderThanMinutes: number): Promise<number>;
  deleteExpiredRequests(): Promise<number>;

  // Bulk operations for sending requests to multiple drivers
  saveMany(requests: RideRequest[]): Promise<RideRequest[]>;
}
