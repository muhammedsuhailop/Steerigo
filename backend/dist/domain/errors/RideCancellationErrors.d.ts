import { DomainError } from "./DomainError";
export declare class RideCancellationErrors {
    static rideNotFound(rideId: string): DomainError;
    static unauthorizedCancellation(rideId: string): DomainError;
    static rideAlreadyCancelled(rideId: string): DomainError;
    static cannotCancelCompletedRide(rideId: string): DomainError;
    static cannotCancelStartedRide(rideId: string): DomainError;
    static chargeCalculationFailed(rideId: string, reason: string): DomainError;
    static fareResetFailed(rideId: string, reason: string): DomainError;
    static invalidCancellationReason(reason: string): DomainError;
    static driverNotFound(userId: string): DomainError;
    static unauthorizedDriverCancellation(driverId: string, rideId: string): DomainError;
    static driverChargeCalculationFailed(rideId: string, reason: string): DomainError;
    static driverFareResetFailed(rideId: string, reason: string): DomainError;
    static invalidDriverCancellationReason(reason: string): DomainError;
    static walletNotFound(driverId: string): DomainError;
}
//# sourceMappingURL=RideCancellationErrors.d.ts.map