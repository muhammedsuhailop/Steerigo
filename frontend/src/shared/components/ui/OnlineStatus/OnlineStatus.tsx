import React from "react";
import type { OnlineStatusProps } from "./OnlineStatus.types";

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  size = "md",
  showPulse = true,
  className = "",
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          badge: "px-2 py-1 text-xs",
          dot: "w-1.5 h-1.5",
        };
      case "lg":
        return {
          badge: "px-4 py-2 text-base",
          dot: "w-3 h-3",
        };
      default: // md
        return {
          badge: "px-3 py-1 text-sm",
          dot: "w-2 h-2",
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const badgeClass = `flex items-center space-x-2 rounded-full font-medium ${
    sizeStyles.badge
  } ${
    isOnline ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
  } ${className}`;

  const dotClass = `${sizeStyles.dot} rounded-full ${
    isOnline ? "bg-emerald-500" : "bg-gray-400"
  } ${isOnline && showPulse ? "animate-pulse" : ""}`;

  return (
    <div className={badgeClass}>
      <div className={dotClass}></div>
      <span>{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
};
