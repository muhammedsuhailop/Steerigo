import { Component, ErrorInfo, ReactNode } from "react";
import { BaseError, ErrorType, ErrorSeverity } from "./ErrorHandling.types";
import { errorHandler } from "../../../utils/errorHandler";

interface Props {
  children: ReactNode;
  fallback?: (error: BaseError, resetError: () => void) => ReactNode;
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
      timestamp: new Date(),
      context: "React Error Boundary",
      details: { stack: error.stack, name: error.name },
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
      timestamp: new Date(),
      context: "React Error Boundary",
      details: {
        stack: error.stack,
        name: error.name,
        componentStack: errorInfo.componentStack,
      },
    };

    // Log the error
    errorHandler.logError(parsedError);

    // Call custom error handler if provided
    this.props.onError?.(parsedError, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.08 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {this.state.error.userMessage}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Reload Page
              </button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto max-h-40">
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
