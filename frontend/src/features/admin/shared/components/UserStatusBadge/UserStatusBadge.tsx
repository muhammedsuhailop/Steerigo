import React from "react";
import { Badge } from "@/shared/components/ui";
import { User } from "@/features/admin/user/user-management/components/UserManagement";

interface UserStatusBadgeProps {
  status: User["status"];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const getBadgeVariant = (userStatus: string) => {
    switch (userStatus) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "warning";
      case "Pending Verification":
        return "info";
      case "Blocked":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getBadgeVariant(status)} size={size} className={className}>
      {status}
    </Badge>
  );
};
