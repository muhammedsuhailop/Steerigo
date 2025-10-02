import React from "react";
import { AlertProps } from "./Alert.types";

export const Alert: React.FC<AlertProps> = ({
  children,
  message,
  type,
  variant,
  onClose,
  className = "",
}) => {
  // Pick from type first, then fallback to variant
  const resolvedType = type || variant || "danger";

  const bgColor =
    resolvedType === "success"
      ? "bg-green-100 border-green-500"
      : "bg-red-100 border-red-500";

  const textColor =
    resolvedType === "success" ? "text-green-700" : "text-red-700";

  return (
    <div
      className={`p-4 border-l-4 rounded ${bgColor} ${textColor} shadow-sm flex items-start gap-3 ${className}`}
    >
      <div className="flex-1">{children || <span>{message}</span>}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
};
