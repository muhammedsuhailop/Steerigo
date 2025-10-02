import React from "react";
import type { StatCardProps } from "./DashboardOverview.types";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiUserLine,
  RiCarLine,
  RiMoneyDollarCircleLine,
  RiSteeringFill,
} from "react-icons/ri";

const getIconComponent = (iconName?: string) => {
  const icons = {
    users: RiUserLine,
    drivers: RiSteeringFill,
    rides: RiCarLine,
    revenue: RiMoneyDollarCircleLine,
  };
  return iconName ? icons[iconName as keyof typeof icons] : null;
};

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const IconComponent = getIconComponent(stat.icon);

  const colorClasses = {
    blue: "bg-blue-50 text-blue-900 border-blue-100",
    green: "bg-green-50 text-green-900 border-green-100",
    yellow: "bg-yellow-50 text-yellow-900 border-yellow-100",
    purple: "bg-purple-50 text-purple-900 border-purple-100",
    red: "bg-red-50 text-red-900 border-red-100",
  };

  const iconColorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[stat.color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{stat.title}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
          {stat.change && (
            <div
              className={`flex items-center mt-2 text-xs ${
                stat.change.type === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change.type === "increase" ? (
                <RiArrowUpLine className="w-4 h-4 mr-1" />
              ) : (
                <RiArrowDownLine className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stat.change.value)}% from last month
            </div>
          )}
        </div>
        {IconComponent && (
          <div className={`p-2 rounded-lg ${iconColorClasses[stat.color]}`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
