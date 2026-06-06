import { DomainError } from "./DomainError";
export declare class KYCNotFoundError extends DomainError {
    constructor(message?: string);
}
export declare class ProfilePictureNotUploadedError extends DomainError {
    constructor(message?: string);
}
export declare class LicenseNotApprovedError extends DomainError {
    constructor(message?: string);
}
export declare class NonLicenseKYCNotApprovedError extends DomainError {
    constructor(message?: string);
}
export declare class InvalidKYCStatusTransitionError extends DomainError {
    constructor(message?: string);
}
//# sourceMappingURL=KYCValidationErrors.d.ts.map