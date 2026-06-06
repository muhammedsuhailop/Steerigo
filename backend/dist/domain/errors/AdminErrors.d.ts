import { DomainError } from "./DomainError";
export declare class AdminUserNotFoundError extends DomainError {
    constructor(userId?: string);
}
export declare class AdminInvalidActionError extends DomainError {
    constructor(action: string);
}
export declare class AdminUnauthorizedActionError extends DomainError {
    constructor(action: string, reason?: string);
}
//# sourceMappingURL=AdminErrors.d.ts.map