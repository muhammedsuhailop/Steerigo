import React from "react";
import { Link } from "react-router-dom";
import type { ActionCardProps } from "./QuickActions.types";
import {
  RiUserAddLine,
  RiCarLine,
  RiEyeLine,
  RiSettingsLine,
  RiFileTextLine,
  RiTicket2Line,
  RiWallet3Line,
  RiExchangeDollarLine,
} from "react-icons/ri";

const getActionIcon = (iconName: string) => {
  const icons = {
    "add-user": RiUserAddLine,
    "manage-drivers": RiCarLine,
    "view-reports": RiEyeLine,
    "system-settings": RiSettingsLine,
    "manage-kyc": RiFileTextLine,
    "manage-coupons": RiTicket2Line,
    "view-payouts": RiWallet3Line,
    "view-transactions": RiExchangeDollarLine,
  };
  return icons[iconName as keyof typeof icons];
};

export const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const IconComponent = getActionIcon(action.icon);

  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100",
    green: "border-green-200 hover:border-green-300 hover:shadow-green-100",
    yellow: "border-yellow-200 hover:border-yellow-300 hover:shadow-yellow-100",
    purple: "border-purple-200 hover:border-purple-300 hover:shadow-purple-100",
    red: "border-red-200 hover:border-red-300 hover:shadow-red-100",
  };

  const iconColorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Link
      to={action.path}
      className={`block p-6 bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
        colorClasses[action.color]
      }`}
    >
      <div className="flex items-start space-x-4">
        {IconComponent && (
          <div className={`p-3 rounded-lg ${iconColorClasses[action.color]}`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {action.title}
          </h4>
          <p className="text-gray-600 text-sm">{action.description}</p>
        </div>
      </div>
    </Link>
  );
};
