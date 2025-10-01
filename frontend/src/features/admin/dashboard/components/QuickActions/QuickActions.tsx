import React from "react";
import { ActionCard } from "./ActionCard";
import type { QuickActionsProps, QuickAction } from "./QuickActions.types";

const quickActions: QuickAction[] = [
  {
    id: "manage-users",
    title: "Manage Users",
    description: "View, add, and manage user accounts",
    icon: "add-user",
    color: "blue",
    path: "/admin/users",
  },
  {
    id: "manage-drivers",
    title: "Manage Drivers",
    description: "Oversee driver registrations and status",
    icon: "manage-drivers",
    color: "green",
    path: "/admin/drivers",
  },
  {
    id: "kyc-verification",
    title: "KYC Verification",
    description: "Review pending document verifications",
    icon: "manage-kyc",
    color: "yellow",
    path: "/admin/kyc",
  },
  {
    id: "view-reports",
    title: "View Reports",
    description: "Access detailed analytics and reports",
    icon: "view-reports",
    color: "purple",
    path: "/admin/reports",
  },
  {
    id: "manage-coupons",
    title: "Manage Coupons",
    description: "Create and manage promotional codes",
    icon: "manage-coupons",
    color: "red",
    path: "/admin/coupons",
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure platform settings",
    icon: "system-settings",
    color: "blue",
    path: "/admin/settings",
  },
];

export const QuickActions: React.FC<QuickActionsProps> = () => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
};
