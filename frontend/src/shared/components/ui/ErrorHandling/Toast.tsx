import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BaseError, ErrorSeverity } from "./ErrorHandling.types";
import { clearErrorByIndex } from "./errorSlice";
import type { RootState } from "../../../../app/store/store";
import {
  FiCheckCircle,
  FiInfo,
  FiAlertCircle,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

interface ToastProps {
  error: BaseError;
  index: number;
  onClose: () => void;
}

// Individual Toast Component
const Toast: React.FC<ToastProps> = ({ error, index, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const dispatch = useDispatch();

  // Auto-close for LOW (8s) and MEDIUM (16s)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (error.severity === ErrorSeverity.LOW) {
      timer = setTimeout(() => {
        handleClose();
      }, 8000);
    }

    if (error.severity === ErrorSeverity.MEDIUM) {
      timer = setTimeout(() => {
        handleClose();
      }, 16000);
    }

    return () => clearTimeout(timer);
  }, [error.severity]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(clearErrorByIndex(index));
      onClose();
    }, 300);
  };

  // Get icon based on severity
  const getIcon = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return <FiInfo className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case ErrorSeverity.MEDIUM:
        return (
          <FiAlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
        );
      case ErrorSeverity.HIGH:
        return (
          <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        );
      case ErrorSeverity.CRITICAL:
        return (
          <FiAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        );
      default:
        return null;
    }
  };

  // Get background and border colors based on severity
  const getSeverityStyles = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return "bg-blue-50 border-l-4 border-blue-400";
      case ErrorSeverity.MEDIUM:
        return "bg-yellow-50 border-l-4 border-yellow-400";
      case ErrorSeverity.HIGH:
        return "bg-red-50 border-l-4 border-red-400";
      case ErrorSeverity.CRITICAL:
        return "bg-red-100 border-l-4 border-red-600";
      default:
        return "bg-gray-50 border-l-4 border-gray-400";
    }
  };

  // Get text color for message based on severity
  const getTextColorClass = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return "text-blue-900";
      case ErrorSeverity.MEDIUM:
        return "text-yellow-900";
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return "text-red-900";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div
      className={`
        max-w-md w-full rounded-lg shadow-lg pointer-events-auto 
        ring-1 ring-black ring-opacity-5 overflow-hidden 
        transition-all duration-300 transform
        ${getSeverityStyles()}
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
      `}
    >
      <div className="flex items-start p-4 gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main Message */}
          <p className={`text-sm font-medium ${getTextColorClass()}`}>
            {error.userMessage || error.message}
          </p>

          {/* Field (if validation error) */}
          {error.field && (
            <p className={`text-xs mt-1 ${getTextColorClass()} opacity-75`}>
              Field: <span className="font-semibold">{error.field}</span>
            </p>
          )}

          {/* Dev-only: Context (if available) */}
          {import.meta.env.DEV && error.context && (
            <p className={`text-xs mt-1 ${getTextColorClass()} opacity-75`}>
              {error.context}
            </p>
          )}

          {/* Dev-only: Details in development */}
          {import.meta.env.DEV && error.details && (
            <details className="mt-2 text-xs">
              <summary
                className={`cursor-pointer font-semibold ${getTextColorClass()}`}
              >
                Details
              </summary>
              <pre
                className={`mt-1 p-2 bg-white bg-opacity-50 rounded text-xs overflow-auto ${getTextColorClass()}`}
              >
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`flex-shrink-0 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors ${getTextColorClass()}`}
          aria-label="Close notification"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container - displays all toasts
export const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state: RootState) => state.error.errors);

  return (
    <div className="fixed bottom-4 right-4 space-y-3 pointer-events-none max-w-md z-50">
      {errors.map((error, index) => (
        <div key={`${error.code}-${index}`} className="pointer-events-auto">
          <Toast
            error={error}
            index={index}
            onClose={() => {
              // Optional: trigger additional action on close
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
