import { RideRequestStatus } from "../value-objects/RideRequestStatus";
import { DomainError } from "./DomainError";
export declare class RideRequestErrors {
    static driverNotFound(driverId: string): DomainError;
    static rideRequestNotFound(requestId: string): DomainError;
    static noPendingRequestsFound(): DomainError;
    static userNotFound(userId: string): DomainError;
    static invalidFare(fare: number): DomainError;
    static invalidPickupTime(pickupTime: Date): DomainError;
    static invalidLocation(fieldName: string): DomainError;
    static invalidRideType(rideType: string): DomainError;
    static driverNotAvailable(driverId: string): DomainError;
    static duplicateRideRequest(riderId: string, driverId: string): DomainError;
    static rideRequestNotForDriver(requestId: string, driverId: string): DomainError;
    static rideRequestNotPending(requestId: string, requestStatus: RideRequestStatus): DomainError;
    static rideRequestCreationFailed(reason?: string): DomainError;
    static requestAlreadyBeingProcessed(requestId: string): DomainError;
    static requestAlreadyAccepted(requestId: string): DomainError;
    static rideRequestExpired(requestId: string): DomainError;
}
//# sourceMappingURL=RideRequestErrors.d.ts.map