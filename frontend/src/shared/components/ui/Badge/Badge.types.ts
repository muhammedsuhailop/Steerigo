export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}
