import { DomainError } from "./DomainError";
export declare class UserNotFoundError extends DomainError {
    constructor(userId: string);
}
export declare class DriverProfileNotFoundError extends DomainError {
    constructor(userId: string);
}
export declare class KycDocumentNotFoundError extends DomainError {
    constructor(driverId: string, docType?: string);
}
export declare class ResourceNotFoundError extends DomainError {
    constructor(resource: string, identifier: string);
}
export declare class DriverAccessDeniedError extends DomainError {
    constructor(userId: string, reason: string);
}
//# sourceMappingURL=DriverProfileErrors.d.ts.map