export { Button } from "./Button";
export { Input } from "./Input";
export { LoadingSpinner } from "./LoadingSpinner";
export { Select } from "./Select";
export { DateInput } from "./DateInput";
export { TextArea } from "./TextArea";
export { Logo } from "./Logo";
export { Table, TablePagination } from "./Table";
export { Badge } from "./Badge";
export { ConfirmationModal } from "./ConfirmationModal";

// Error Handling exports
export { ErrorBoundary } from "./ErrorHandling/ErrorBoundary";
export { ToastContainer, GlobalErrorModal } from "./ErrorHandling/Toast";
export { 
  addError,
  removeError,
  clearErrors,
  clearErrorsByType,
  clearErrorsByContext,
  clearErrorsByField,
  setGlobalError,
  hideGlobalError,
  showGlobalError,
  selectErrors,
  selectGlobalError,
  selectIsErrorVisible,
  selectErrorsByType,
  selectErrorsByField,
  selectErrorsByContext
} from "./ErrorHandling/errorSlice";

// Type exports
export type { ButtonProps } from "./Button";
export type { InputProps } from "./Input";
export type { DateInputProps } from "./DateInput";
export type { LoadingSpinnerProps } from "./LoadingSpinner";
export type { LogoProps } from "./Logo";
export type { TableProps, Column, TablePaginationProps } from "./Table";
export type { BadgeProps } from "./Badge";
export type {
  ConfirmationModalProps,
  ConfirmationVariant,
} from "./ConfirmationModal";

// Error Handling types
export type {
  BaseError,
  ValidationError,
  NetworkError,
  ServerError,
  ErrorState,
  ErrorBoundaryProps,
  ToastProps,
  ErrorDisplayProps
} from "./ErrorHandling/ErrorHandling.types";

export { ErrorType, ErrorSeverity } from "./ErrorHandling/ErrorHandling.types";