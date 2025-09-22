import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { errorHandler, AuthContext } from "../utils/errorUtils";
import { BaseError, ErrorType, ErrorSeverity } from "../components/ui/ErrorHandling/ErrorHandling.types";

/**
 * RTK Query error middleware to integrate API errors with centralized error handling
 */
export const rtkQueryErrorMiddleware: Middleware = 
  (api: MiddlewareAPI) => (next) => (action) => {
    // Handle RTK Query rejected actions
    if (isRejectedWithValue(action)) {
      const { payload, meta, type } = action;
      
      // Extract endpoint information safely
      const endpointName = (meta?.arg as { endpointName?: string } | undefined)?.endpointName || 'unknown';
      const isAuthEndpoint = type.includes('authApi/');
      
      // Determine context based on endpoint
      const context = getErrorContext(endpointName, isAuthEndpoint);
      
      // Handle different types of errors
      const pl: any = payload;
      
      if (pl?.status === 'FETCH_ERROR' || pl?.status === 'PARSING_ERROR') {
        // Network or parsing errors
        const networkError: BaseError = {
          type: ErrorType.NETWORK,
          code: pl.status,
          message: pl.error || 'Network error occurred',
          userMessage: 'Connection failed. Please check your internet and try again.',
          severity: ErrorSeverity.HIGH,
          timestamp: new Date(),
          context,
          details: { originalError: pl }
        };
        errorHandler.dispatchError(networkError);
      } else if (pl?.data) {
        // API errors with response data
        errorHandler.handleAuthError(
          { response: { status: pl.status, data: pl.data } },
          context
        );
      } else {
        // Generic errors
        const genericError: BaseError = {
          type: ErrorType.UNKNOWN,
          code: 'RTK_QUERY_ERROR',
          message: pl?.error || 'An unexpected error occurred',
          userMessage: 'Something went wrong. Please try again.',
          severity: ErrorSeverity.MEDIUM,
          timestamp: new Date(),
          context,
          details: { payload: pl, meta }
        };
        errorHandler.dispatchError(genericError);
      }
    }

    return next(action);
  };

/**
 * Map endpoint names to appropriate error contexts
 */
function getErrorContext(endpointName: string, isAuthEndpoint: boolean): string {
  if (!isAuthEndpoint) {
    return 'api:general';
  }

  const contextMap: Record<string, string> = {
    'login': AuthContext.LOGIN,
    'signup': AuthContext.SIGNUP,
    'verifyOTP': AuthContext.OTP_VERIFICATION,
    'verifySignupOTP': AuthContext.OTP_VERIFICATION,
    'resendOTP': AuthContext.OTP_VERIFICATION,
    'resendSignupOTP': AuthContext.OTP_VERIFICATION,
    'forgotPassword': AuthContext.PASSWORD_RESET,
    'resetPassword': AuthContext.PASSWORD_RESET,
    'updatePassword': AuthContext.PASSWORD_UPDATE,
    'refreshToken': AuthContext.TOKEN_REFRESH,
    'initiateGoogleAuth': AuthContext.GOOGLE_AUTH,
    'handleGoogleCallback': AuthContext.GOOGLE_AUTH,
    'logout': AuthContext.LOGOUT,
    'getCurrentUser': 'auth:user_fetch'
  };

  return contextMap[endpointName] || 'auth:general';
}