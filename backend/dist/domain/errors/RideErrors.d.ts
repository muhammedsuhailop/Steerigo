import { DomainError } from "./DomainError";
export declare class RideErrors {
    static rideNotFound(rideId: string): DomainError;
    static rideAlreadyAccepted(rideId: string): DomainError;
    static rideAlreadyStarted(rideId: string): DomainError;
    static rideAlreadyCompleted(rideId: string): DomainError;
    static rideAlreadyCancelled(rideId: string): DomainError;
    static driverAlreadyHasActiveRide(driverId: string, existingRideId: string): DomainError;
    static riderAlreadyHasActiveRide(riderId: string, existingRideId: string): DomainError;
    static invalidRideStatusTransition(from: string, to: string, rideId: string): DomainError;
    static rideCreationFailed(reason: string): DomainError;
    static unauthorizedRideAccess(rideId: string): DomainError;
    static cannotMarkAsArrived(rideId: string, currentStatus: string): DomainError;
    static cannotRateIncompleteRide(rideId: string): DomainError;
    static rideAlreadyRated(rideId: string): DomainError;
    static driverNotFoundForRide(rideId: string): DomainError;
    static invalidRatingValue(): DomainError;
    static invalidRatingData(reason: string): DomainError;
    static rideNotEligibleForCoupon(rideId: string, currentStatus: string): DomainError;
    static timeSlotConflict(): DomainError;
    static invalidVerificationCode(rideId: string): DomainError;
}
//# sourceMappingURL=RideErrors.d.ts.map