import { IRideRequestRepository, IRideRequestFilters } from "@domain/repositories/IRideRequestRepository";
import { RideRequest } from "@domain/entities/RideRequest";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
export declare class RideRequestRepositoryImpl implements IRideRequestRepository {
    findById(id: string): Promise<RideRequest | null>;
    exists(id: string): Promise<boolean>;
    save(request: RideRequest): Promise<RideRequest>;
    delete(id: string): Promise<void>;
    findAll(options?: QueryOptions): Promise<RideRequest[]>;
    count(filters?: IRideRequestFilters): Promise<number>;
    findPaginated(options: QueryOptions<RideRequest> & {
        filters?: IRideRequestFilters;
    }): Promise<PaginatedResult<RideRequest>>;
    findByDriverId(driverId: string, options?: QueryOptions): Promise<RideRequest[]>;
    findPendingByDriverId(driverId: string): Promise<RideRequest[]>;
    countPendingByDriverId(driverId: string): Promise<number>;
    findByRiderId(riderId: string, options?: QueryOptions): Promise<RideRequest[]>;
    findPendingByRiderId(riderId: string): Promise<RideRequest[]>;
    findByStatus(status: RideRequestStatus, options?: QueryOptions): Promise<RideRequest[]>;
    findExpiredRequests(): Promise<RideRequest[]>;
    findByRequestId(requestId: string): Promise<RideRequest | null>;
    expirePendingRequests(olderThanMinutes: number): Promise<number>;
    deleteExpiredRequests(): Promise<number>;
    saveMany(requests: RideRequest[]): Promise<RideRequest[]>;
    updateMany(filters: IRideRequestFilters, updates: Partial<RideRequest>): Promise<number>;
    deleteMany(filters: IRideRequestFilters): Promise<number>;
    existsByFilter(filters: IRideRequestFilters): Promise<boolean>;
    findByIds(ids: string[]): Promise<RideRequest[]>;
    findByGroupAndDriver(requestGroupId: string, driverId: string): Promise<RideRequest | null>;
    atomicAcceptRideRequest(requestId: string): Promise<RideRequest | null>;
    cancelOtherPendingRequestsInGroup(requestGroupId: string, acceptedRequestId: string): Promise<number>;
    existsAcceptedRequestInGroup(requestGroupId: string): Promise<boolean>;
    cancelPendingByGroupAndRider(requestGroupId: string, riderId: string): Promise<number>;
    findLatestPendingByGroupId(requestGroupId: string): Promise<RideRequest | null>;
    atomicExpireRideRequest(requestId: string): Promise<RideRequest | null>;
    private buildFilterQuery;
}
//# sourceMappingURL=RideRequestRepositoryImpl.d.ts.map