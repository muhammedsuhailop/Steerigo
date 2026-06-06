import { ApiResponse } from "../types/Common";
export declare class ErrorHandlerService {
    private static classificationService;
    private static responseBuilder;
    static handleError(error: unknown, context?: string): {
        response: ApiResponse;
        statusCode: number;
    };
    static handleValidationErrors(errors: Array<{
        msg: string;
        param?: string;
    }>): {
        response: ApiResponse;
        statusCode: number;
    };
    static isOperationalError(error: unknown): boolean;
}
//# sourceMappingURL=ErrorHandlerService.d.ts.map