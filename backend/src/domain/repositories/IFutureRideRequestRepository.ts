import { ICrudRepository } from "./ICrudRepository";
import { FutureRideRequest } from "@domain/entities/FutureRideRequest";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

export interface IFutureRideRequestRepository extends ICrudRepository<FutureRideRequest> {
  findByRequestGroupId(requestGroupId: string): Promise<FutureRideRequest[]>;
  findByRiderId(riderId: string): Promise<FutureRideRequest[]>;
  findPendingByGroupId(requestGroupId: string): Promise<FutureRideRequest[]>;
  cancelAllPendingInGroup(requestGroupId: string): Promise<number>;
  markExpiredAllPendingInGroup(requestGroupId: string): Promise<number>;
  countByGroupAndStatus(
    requestGroupId: string,
    status: FutureRideRequestStatus,
  ): Promise<number>;
  existsAcceptedInGroup(requestGroupId: string): Promise<boolean>;
  findByDriverIdWithFilters(
    driverId: string,
    filters: {
      status?: FutureRideRequestStatus;
      offset: number;
      limit: number;
    },
  ): Promise<{ requests: FutureRideRequest[]; total: number }>;
}
