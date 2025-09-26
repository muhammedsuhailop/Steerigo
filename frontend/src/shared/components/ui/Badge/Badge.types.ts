export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "info"
    | "success"
    | "warning"
    | "secondary"
    | "danger"
    | "primary"
    | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}
