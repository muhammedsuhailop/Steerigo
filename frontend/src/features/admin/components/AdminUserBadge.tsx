import React from "react";
import { Badge, BadgeProps } from "@/shared/components/ui/Badge";
import { AdminUserBadgeProps } from "../types/component.interfaces";

export const AdminUserBadge: React.FC<AdminUserBadgeProps> = ({
  user,
  type,
}) => {
  const getBadgeProps = (): {
    variant: BadgeProps["variant"];
    text: string;
  } => {
    switch (type) {
      case "status":
        return {
          variant: getStatusVariant(user.status),
          text: user.status || "Unknown",
        };
      case "role":
        return {
          variant: getRoleVariant(user.role),
          text: user.role || "Unknown",
        };
      case "verification":
        return {
          variant: user.isVerified ? "success" : "warning",
          text: user.isVerified ? "Verified" : "Unverified",
        };
      default:
        return {
          variant: "secondary",
          text: "Unknown",
        };
    }
  };

  const getStatusVariant = (status?: string): BadgeProps["variant"] => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "warning";
      case "Suspended":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getRoleVariant = (role: string): BadgeProps["variant"] => {
    switch (role) {
      case "Admin":
        return "primary";
      case "Driver":
        return "info";
      case "Rider":
        return "outline";
      default:
        return "outline";
    }
  };

  const { variant, text } = getBadgeProps();

  return (
    <Badge variant={variant} size="sm">
      {text}
    </Badge>
  );
};
