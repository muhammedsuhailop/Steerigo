import { DomainError } from "./DomainError";
export declare class NoDriversAvailableError extends DomainError {
    constructor(message?: string);
}
export declare class InvalidLocationError extends DomainError {
    constructor(message?: string);
}
export declare class InvalidSearchDateError extends DomainError {
    constructor(message?: string);
}
export declare class DriverFilterNotMatchError extends DomainError {
    constructor(message?: string);
}
export declare class LocationServiceError extends DomainError {
    constructor(message?: string);
}
//# sourceMappingURL=DriverSearchErrors.d.ts.map