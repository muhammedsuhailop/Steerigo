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

export { MessagesDropdown } from "./Messages";
export { WalletDropdown } from "./Wallet";
export { OnlineStatus } from "./OnlineStatus";
export { NotificationDropdown } from "./Notification";
export { ProfileDropdown } from "./Profile";

export { Card, CardBody, CardFooter, CardHeader } from "./Card";
export { Modal } from "./Modal";
export { Alert } from "./Alert";

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
  selectErrorsByContext,
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
export type { MessagesDropdownProps, Message } from "./Messages";
export type { WalletDropdownProps, Transaction } from "./Wallet";
export type { OnlineStatusProps } from "./OnlineStatus";

// Error Handling types
export type {
  BaseError,
  ValidationError,
  NetworkError,
  ServerError,
  ErrorState,
  ErrorBoundaryProps,
  ToastProps,
  ErrorDisplayProps,
} from "./ErrorHandling/ErrorHandling.types";
export { ErrorType, ErrorSeverity } from "./ErrorHandling/ErrorHandling.types";
