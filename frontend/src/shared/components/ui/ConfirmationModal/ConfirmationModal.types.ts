export type ConfirmationVariant =
  | "info"
  | "warning"
  | "danger"
  | "success"
  | "question";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}
