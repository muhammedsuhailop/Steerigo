import { ReactNode } from "react";

export interface AlertProps {
  message?: string;
  type?: "success" | "error" | "danger";
  variant?: "success" | "danger";
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
}
