import React from "react";
import { AlertProps } from "./Alert.types";

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500"
      : "bg-red-100 border-red-500";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";

  return (
    <div
      className={`fixed top-4 right-4 p-4 border-l-4 rounded ${bgColor} ${textColor} shadow-lg z-50`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};
