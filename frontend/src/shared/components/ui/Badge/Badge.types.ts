export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}
