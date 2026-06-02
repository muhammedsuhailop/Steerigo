import { ErrorType } from "@shared/enums/ErrorType";
import { ErrorMetadata } from "@shared/errors/ErrorMetadata";
export declare class DomainError extends Error {
    readonly code?: string;
    readonly metadata?: ErrorMetadata;
    constructor(message: string, code?: string, metadata?: Partial<ErrorMetadata>);
    private buildMetadata;
    getMetadata(): ErrorMetadata;
    getStatusCode(): number;
    getErrorType(): ErrorType;
    shouldLog(): boolean;
    isOperational(): boolean;
}
//# sourceMappingURL=DomainError.d.ts.map