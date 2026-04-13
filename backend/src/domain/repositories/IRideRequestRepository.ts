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
    options?: QueryOptions,
  ): Promise<RideRequest[]>;
  findPendingByDriverId(driverId: string): Promise<RideRequest[]>;
  countPendingByDriverId(driverId: string): Promise<number>;

  // Rider-specific queries
  findByRiderId(
    riderId: string,
    options?: QueryOptions,
  ): Promise<RideRequest[]>;
  findPendingByRiderId(riderId: string): Promise<RideRequest[]>;

  // Status-based queries
  findByStatus(
    status: RideRequestStatus,
    options?: QueryOptions,
  ): Promise<RideRequest[]>;
  findExpiredRequests(): Promise<RideRequest[]>;

  // Specialized operations
  findByRequestId(requestId: string): Promise<RideRequest | null>;
  expirePendingRequests(olderThanMinutes: number): Promise<number>;
  deleteExpiredRequests(): Promise<number>;
  findByGroupAndDriver(
    requestGroupId: string,
    driverId: string,
  ): Promise<RideRequest | null>;
  atomicAcceptRideRequest(requestId: string): Promise<RideRequest | null>;
  cancelOtherPendingRequestsInGroup(
    requestGroupId: string,
    acceptedRequestId: string,
  ): Promise<number>;
  cancelPendingByGroupAndRider(
    requestGroupId: string,
    riderId: string,
  ): Promise<number>;

  existsAcceptedRequestInGroup(requestGroupId: string): Promise<boolean>;

  findLatestPendingByGroupId(
    requestGroupId: string,
  ): Promise<RideRequest | null>;
  atomicExpireRideRequest(requestId: string): Promise<RideRequest | null>;

  saveMany(requests: RideRequest[]): Promise<RideRequest[]>;
}
