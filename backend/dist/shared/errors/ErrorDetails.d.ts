import { ErrorType } from "@shared/enums/ErrorType";
export interface ErrorDetails {
    statusCode: number;
    message: string;
    type: ErrorType;
    shouldLog: boolean;
    isOperational: boolean;
}
//# sourceMappingURL=ErrorDetails.d.ts.map