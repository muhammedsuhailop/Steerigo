import React from "react";
import type { DriverProfileProps } from "./DriverProfile.types";

export const DriverProfile: React.FC<DriverProfileProps> = ({
  driver,
  className = "",
}) => {
  console.log("Driver Profile Image URL:", driver.profileImageUrl);

  const getStatusBadgeVariant = (statusStr?: string) => {
    switch (statusStr) {
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

  const getStringValue = (val?: string | { value?: string } | null) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.value ?? "";
  };

  const email = getStringValue(driver.email as any);
  const mobile = getStringValue(driver.mobile as any);

  const initials =
    (driver.name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Driver Profile</h2>
      </div>

      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {driver.profileImageUrl ? (
            <img
              src={driver.profileImageUrl}
              alt={`${driver.name ?? "Driver"}'s profile`}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {driver.name ?? "Unknown Driver"}
          </h3>
          {email ? (
            <p className="text-sm text-gray-600">{email}</p>
          ) : (
            <p className="text-sm text-gray-500">Email not available</p>
          )}
          {mobile ? (
            <p className="text-sm text-gray-600">{mobile}</p>
          ) : (
            <p className="text-sm text-gray-500">Mobile not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
