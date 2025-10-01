import React from "react";
import type { SystemStatusProps, StatusCard } from "./SystemStatus.types";
import { MdOutlineRefresh } from "react-icons/md";

export const SystemStatus: React.FC<SystemStatusProps> = ({
  stats,
  loading = false,
  onRefresh,
  className = "",
}) => {
  const getStatusCards = (): StatusCard[] => [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      dotColor: "bg-emerald-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      dotColor: "bg-blue-500",
    },
    {
      title: "Pending Verification ",
      value: stats.pendingUsers,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      dotColor: "bg-purple-500",
    },
    {
      title: "Suspended Users",
      value: stats.suspendedUsers,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-100",
      dotColor: "bg-yellow-500",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-100",
      dotColor: "bg-red-500",
    },
  ];

  const statusCards = getStatusCards();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : <MdOutlineRefresh />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 ${card.bgColor} rounded-lg border ${card.borderColor}`}
          >
            <div>
              <p className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </p>
              <p
                className={`text-2xl font-bold ${card.textColor.replace(
                  "600",
                  "900"
                )}`}
              >
                {loading ? "..." : card.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-3 h-3 ${card.dotColor} rounded-full`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};
