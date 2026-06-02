import { DomainError } from "./DomainError";
export declare class ValidationError extends DomainError {
    readonly field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
export declare class InvalidLatitudeError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidLongitudeError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidSearchDateFormatError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidSearchDateRangeError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidTimeRequiredError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidRadiusError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidLimitError extends ValidationError {
    constructor(message?: string);
}
export declare class InvalidGearTypeError extends ValidationError {
    constructor(message: string);
}
export declare class InvalidBodyTypeError extends ValidationError {
    constructor(message: string);
}
//# sourceMappingURL=ValidationErrors.d.ts.map