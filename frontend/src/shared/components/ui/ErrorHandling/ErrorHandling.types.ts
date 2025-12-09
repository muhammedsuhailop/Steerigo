export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  CLIENT = "CLIENT",
  UNKNOWN = "UNKNOWN",
}

export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface BaseError {
  type: ErrorType;
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  timestamp: string;
  requestId?: string;
  context?: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError extends BaseError {
  field: string;
  value?: any;
}

export interface NetworkError extends BaseError {
  retryCount?: number;
}

export interface ServerError extends BaseError {
  status: number;
  url?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    userMessage: string;
    field?: string;
    details?: Record<string, any>;
  };
}

// Redux state type
export interface ErrorState {
  errors: BaseError[];
  lastError: BaseError | null;
}
