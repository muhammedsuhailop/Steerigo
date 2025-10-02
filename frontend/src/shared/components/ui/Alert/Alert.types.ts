export interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}
