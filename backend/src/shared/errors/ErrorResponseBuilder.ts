import { injectable } from "inversify";
import { ApiResponse } from "@shared/types/Common";
import { ErrorDetails } from "./ErrorDetails";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class ErrorResponseBuilder {
  build(errorDetails: ErrorDetails): ApiResponse {
    Logger.debug("[ErrorResponseBuilder] Building error response", {
      statusCode: errorDetails.statusCode,
      errorType: errorDetails.type,
    });

    return {
      success: false,
      message: errorDetails.message,
    };
  }

  buildWithData(
    errorDetails: ErrorDetails,
    additionalData?: Record<string, unknown>,
  ): ApiResponse {
    Logger.debug("[ErrorResponseBuilder] Building detailed error response", {
      statusCode: errorDetails.statusCode,
      errorType: errorDetails.type,
      hasAdditionalData: !!additionalData,
    });

    return {
      success: false,
      message: errorDetails.message,
      ...(additionalData && { data: additionalData }),
    };
  }
}
