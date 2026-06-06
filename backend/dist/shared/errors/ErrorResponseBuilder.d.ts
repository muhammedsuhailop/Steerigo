import { ApiResponse } from "../types/Common";
import { ErrorDetails } from "./ErrorDetails";
export declare class ErrorResponseBuilder {
    build(errorDetails: ErrorDetails): ApiResponse;
    buildWithData(errorDetails: ErrorDetails, additionalData?: Record<string, unknown>): ApiResponse;
}
//# sourceMappingURL=ErrorResponseBuilder.d.ts.map