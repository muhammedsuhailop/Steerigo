export interface ApiErrorResponse<T = unknown> {
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

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  error: null;
  requestId: string;
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ValidationErrorDetails {
  [fieldName: string]: string | string[];
}

export interface ServerErrorDetails {
  traceId?: string;
  timestamp?: string;
  path?: string;
}

export type ErrorContext = {
  url?: string;
  method?: string;
  timestamp?: string;
  userId?: string;
};
