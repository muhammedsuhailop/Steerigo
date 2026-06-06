import { DomainError } from "./DomainError";
export declare class DriverAvailabilityNotFoundError extends DomainError {
    constructor(driverId?: string);
}
export declare class InvalidAvailabilityScheduleError extends DomainError {
    constructor(reason: string);
}
export declare class DriverAlreadyAvailableError extends DomainError {
    constructor(driverId: string);
}
export declare class InvalidStatusTransitionError extends DomainError {
    constructor(currentStatus: string, newStatus: string);
}
export declare class ExpiredAvailabilityError extends DomainError {
    constructor();
}
export declare class DriverProfileNotFoundError extends DomainError {
    constructor(userId: string);
}
export declare class AvailabilityExceptionNotFoundError extends DomainError {
    constructor(exceptionId: string);
}
//# sourceMappingURL=DriverAvailabilityErrors.d.ts.map