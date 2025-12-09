import type { AppDispatch } from "@/app/store";
import {
  addError,
  setGlobalError,
} from "@/shared/components/ui/ErrorHandling/errorSlice";
import {
  BaseError,
  ErrorSeverity,
  ErrorType,
} from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";
import { errorHandler } from "@/shared/utils/errorHandler";

// Service to dispatch errors to Redux and show UI (toasts/modals) based on severity
export class ErrorDispatcher {
  private static dispatch: AppDispatch | null = null;

  // Initialize with Redux dispatch 
  public static setDispatch(dispatch: AppDispatch): void {
    ErrorDispatcher.dispatch = dispatch;
    console.log("ErrorDispatcher initialized");
  }

  // Main method: dispatch error to Redux. Routes to modal or toast based on severity.
  public static dispatchError(
    error: BaseError,
    showToast: boolean = true
  ): void {
    if (!ErrorDispatcher.dispatch) {
      console.warn(
        "ErrorDispatcher not initialized. Call ErrorDispatcher.setDispatch(dispatch) in App.tsx"
      );
      errorHandler.logError(error);
      return;
    }

    // Log for debugging/monitoring
    errorHandler.logError(error);

    // HIGH/CRITICAL -> show modal
    if (
      error.severity === ErrorSeverity.HIGH ||
      error.severity === ErrorSeverity.CRITICAL
    ) {
      console.debug(`Dispatching MODAL error: ${error.code}`);
      ErrorDispatcher.dispatch(setGlobalError(error));
    }
    // LOW/MEDIUM + showToast -> show toast
    else if (showToast) {
      console.debug(`Dispatching TOAST error: ${error.code}`);
      ErrorDispatcher.dispatch(addError(error));
    }
    // Otherwise just log (no UI feedback)
  }

  // Map error type to user-facing title
  private static getTitleForType(type: ErrorType): string {
    const titles: Record<string, string> = {
      [ErrorType.AUTHENTICATION]: "Session Expired",
      [ErrorType.AUTHORIZATION]: "Access Denied",
      [ErrorType.VALIDATION]: "Validation Error",
      [ErrorType.NETWORK]: "Connection Error",
      [ErrorType.SERVER]: "Server Error",
      [ErrorType.CLIENT]: "Invalid Request",
      [ErrorType.UNKNOWN]: "Unknown Error",
    };
    return titles[type] || `Error: ${type}`;
  }
}

export const errorDispatcher = ErrorDispatcher;
