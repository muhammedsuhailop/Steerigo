import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BaseError, ErrorSeverity, ToastProps } from "./ErrorHandling.types";
import { removeError, hideGlobalError } from "./errorSlice";
import type { RootState } from "../../../../app/store";

const Toast: React.FC<ToastProps> = ({
  error,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && error.severity === ErrorSeverity.LOW) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, error.severity]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getToastStyles = () => {
    const baseStyles =
      "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 transform";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    const severityStyles = {
      [ErrorSeverity.LOW]: "border-l-4 border-blue-400",
      [ErrorSeverity.MEDIUM]: "border-l-4 border-yellow-400",
      [ErrorSeverity.HIGH]: "border-l-4 border-red-400",
      [ErrorSeverity.CRITICAL]: "border-l-4 border-red-600",
    };

    return `${baseStyles} translate-x-0 opacity-100 ${
      severityStyles[error.severity]
    }`;
  };

  const getIcon = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return (
          <svg
            className="h-5 w-5 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case ErrorSeverity.MEDIUM:
        return (
          <svg
            className="h-5 w-5 text-yellow-400"
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
        );
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return (
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {error.userMessage || error.message}
            </p>
            {error.field && (
              <p className="mt-1 text-xs text-gray-500">Field: {error.field}</p>
            )}
            {error.context && (
              <p className="mt-1 text-xs text-gray-400">{error.context}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Container
export const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state: RootState) => state.error.errors);

  // Only show toast for low and medium severity errors
  const toastErrors = errors.filter(
    (error) =>
      error.severity === ErrorSeverity.LOW ||
      error.severity === ErrorSeverity.MEDIUM
  );

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 w-full max-w-sm pointer-events-none">
      {toastErrors.map((error) => (
        <div
          key={`${error.code}-${error.timestamp.getTime()}`}
          className="pointer-events-auto"
        >
          <Toast
            error={error}
            onClose={() => dispatch(removeError(error.code))}
          />
        </div>
      ))}
    </div>
  );
};

// Global Error Modal for high/critical severity errors
export const GlobalErrorModal: React.FC = () => {
  const dispatch = useDispatch();
  const globalError = useSelector(
    (state: RootState) => state.error.globalError
  );
  const isVisible = useSelector((state: RootState) => state.error.isVisible);

  if (!globalError || !isVisible) return null;

  const handleClose = () => {
    dispatch(hideGlobalError());
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    dispatch(removeError(globalError.code));
    dispatch(hideGlobalError());
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
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
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-500">
              {globalError.userMessage || globalError.message}
            </p>
            {globalError.context && (
              <p className="mt-2 text-xs text-gray-400">
                Context: {globalError.context}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleReload}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
