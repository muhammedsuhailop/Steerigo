import React from "react";
import type { ActivityItemProps } from "./RecentActivity.types";
import {
  RiUserLine,
  RiCarLine,
  RiSteeringFill,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
} from "react-icons/ri";

const getActivityIcon = (type: string) => {
  const icons = {
    user: RiUserLine,
    driver: RiCarLine,
    ride: RiSteeringFill,
    payment: RiMoneyDollarCircleLine,
    kyc: RiShieldCheckLine,
  };
  return icons[type as keyof typeof icons];
};

const getStatusStyles = (status?: string) => {
  const styles = {
    success: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    warning: "bg-orange-100 text-orange-800",
    error: "bg-red-100 text-red-800",
  };
  return status ? styles[status as keyof typeof styles] : "";
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const IconComponent = getActivityIcon(activity.type);
  const statusStyles = getStatusStyles(activity.status);

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {IconComponent && <IconComponent className="w-5 h-5 text-gray-600" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          {activity.status && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles}`}
            >
              {activity.status}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
      </div>
    </div>
  );
};
