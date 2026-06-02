import { DomainError } from "./DomainError";
export declare class FutureRideErrors {
    static noDriversFound(): DomainError;
    static requestGroupNotFound(requestGroupId: string): DomainError;
    static unauthorizedCancellation(requestGroupId: string): DomainError;
    static cannotCancelRequest(requestGroupId: string, status: string): DomainError;
    static pickupTimeTooSoon(): DomainError;
    static scheduleFailed(reason: string): DomainError;
    static timeSlotConflict(): DomainError;
}
//# sourceMappingURL=FutureRideErrors.d.ts.map