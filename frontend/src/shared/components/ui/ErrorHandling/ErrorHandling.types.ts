export enum ErrorType {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NETWORK = "network",
  SERVER = "server",
  CLIENT = "client",
  UNKNOWN = "unknown",
}

export enum ErrorSeverity {
  LOW = "low", // Toast notification
  MEDIUM = "medium", // Toast with action
  HIGH = "high", // Modal dialog
  CRITICAL = "critical", // Full page error
}

export interface BaseError {
  type: ErrorType;
  code: string;
  message: string;
  userMessage?: string;
  severity: ErrorSeverity;
  timestamp: string;
  requestId?: string;
  field?: string;
  details?: Record<string, any>;
  context?: string;
}

export interface ValidationError extends BaseError {
  type: ErrorType.VALIDATION;
  field: string;
  value?: any;
}

export interface NetworkError extends BaseError {
  type: ErrorType.NETWORK;
  status?: number;
  url?: string;
}

export interface ServerError extends BaseError {
  type: ErrorType.SERVER;
  status: number;
  url: string;
}

export interface ApiErrorResponse<T = any> {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    userMessage: string;
    details?: T;
    field?: string;
  };
  requestId: string;
  timestamp: string;
}

export interface ErrorState {
  errors: BaseError[];
  globalError: BaseError | null;
  isVisible: boolean;
}

// Component props interfaces
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: BaseError, resetError: () => void) => React.ReactNode;
  onError?: (error: BaseError, errorInfo: React.ErrorInfo) => void;
}

export interface ToastProps {
  error: BaseError;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export interface ErrorDisplayProps {
  error: BaseError | null;
  onClose?: () => void;
  onRetry?: () => void;
}
