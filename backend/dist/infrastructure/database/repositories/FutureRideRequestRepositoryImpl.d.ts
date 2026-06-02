import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideRequest } from "@domain/entities/FutureRideRequest";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
export declare class FutureRideRequestRepositoryImpl implements IFutureRideRequestRepository {
    findById(id: string): Promise<FutureRideRequest | null>;
    exists(id: string): Promise<boolean>;
    save(entity: FutureRideRequest): Promise<FutureRideRequest>;
    delete(id: string): Promise<boolean>;
    findByRequestGroupId(requestGroupId: string): Promise<FutureRideRequest[]>;
    findByRiderId(riderId: string): Promise<FutureRideRequest[]>;
    findPendingByGroupId(requestGroupId: string): Promise<FutureRideRequest[]>;
    cancelAllPendingInGroup(requestGroupId: string): Promise<number>;
    markExpiredAllPendingInGroup(requestGroupId: string): Promise<number>;
    countByGroupAndStatus(requestGroupId: string, status: FutureRideRequestStatus): Promise<number>;
    existsAcceptedInGroup(requestGroupId: string): Promise<boolean>;
    findByDriverIdWithFilters(driverId: string, filters: {
        status?: FutureRideRequestStatus;
        offset: number;
        limit: number;
    }): Promise<{
        requests: FutureRideRequest[];
        total: number;
    }>;
    hasAnyActiveRequestInGroup(requestGroupId: string): Promise<boolean>;
}
//# sourceMappingURL=FutureRideRequestRepositoryImpl.d.ts.map