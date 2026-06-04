import { ErrorType } from "@shared/enums/ErrorType";
export interface ErrorMetadata {
    statusCode: number;
    errorType: ErrorType;
    shouldLog: boolean;
    isOperational: boolean;
    category?: "NOT_FOUND" | "VALIDATION" | "CONFLICT" | "AUTH" | "SERVER" | "SECURITY" | "BUSINESS";
}
export declare class ErrorMetadataInferrer {
    static inferFromCode(code?: string): ErrorMetadata;
}
//# sourceMappingURL=ErrorMetadata.d.ts.map