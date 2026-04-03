import { Component, ErrorInfo, ReactNode } from "react";
import { BaseError, ErrorType, ErrorSeverity } from "./ErrorHandling.types";
import { errorHandler } from "../../../utils/errorHandler";
import { store } from "../../../../app/store/store";
import { addError } from "./errorSlice";

interface Props {
  children: ReactNode;
  onError?: (error: BaseError, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: BaseError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const parsedError: BaseError = {
      type: ErrorType.CLIENT,
      code: "REACT_ERROR",
      message: error.message,
      userMessage: "Something went wrong with this component.",
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context: "React Error Boundary",
      requestId: `rb_${Date.now()}`,
      details: {
        stack: error.stack,
        name: error.name,
      },
    };

    return {
      hasError: true,
      error: parsedError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const parsedError: BaseError = {
      type: ErrorType.CLIENT,
      code: "REACT_ERROR",
      message: error.message,
      userMessage: "Something went wrong with this component.",
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context: "React Error Boundary",
      requestId: `rb_${Date.now()}`,
      details: {
        stack: error.stack,
        name: error.name,
        componentStack: errorInfo.componentStack,
      },
    };

    // Log the error
    errorHandler.logError(parsedError);

    // Dispatch to Redux to show as toast
    store.dispatch(addError(parsedError));

    // Call custom error handler if provided
    this.props.onError?.(parsedError, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Show minimal fallback UI, error will be shown as toast
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-4">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-gray-600">
                {this.state.error.userMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={this.resetError}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm"
              >
                Reload
              </button>
            </div>

            {/* Dev Details */}
            {import.meta.env.DEV && (
              <details className="mt-6 border border-gray-300 rounded-lg p-3">
                <summary className="font-semibold text-gray-700 cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-3 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64 text-gray-800">
                  {JSON.stringify(this.state.error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
