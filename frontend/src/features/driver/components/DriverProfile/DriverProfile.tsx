import React from "react";
import { Badge } from "@/shared/components/ui";
import type { DriverProfileProps } from "./DriverProfile.types";

export const DriverProfile: React.FC<DriverProfileProps> = ({
  driver,
  isOnline,
  onToggleStatus,
  loading = false,
  className = "",
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Available":
        return "success" as const;
      case "Busy":
        return "warning" as const;
      case "Offline":
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Driver Profile</h2>
        <Badge variant={getStatusBadgeVariant(driver.currentStatus)}>
          {driver.currentStatus}
        </Badge>
      </div>

      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {driver.profileImage ? (
            <img
              src={driver.profileImage}
              alt={`${driver.name}'s profile`}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {driver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
          <p className="text-sm text-gray-600">{driver.email}</p>
          <p className="text-sm text-gray-600">{driver.mobile}</p>
        </div>

        {/* Status Toggle */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onToggleStatus(!isOnline)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isOnline
                ? "bg-red-100 hover:bg-red-200 text-red-700"
                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
            } disabled:opacity-50`}
          >
            {loading ? "Loading..." : isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>
    </div>
  );
};
