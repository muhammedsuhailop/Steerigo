import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaHourglassHalf, FaRegCircle } from "react-icons/fa";
import { DriverAvailabilityStatus } from "../types/scheduling.types";

interface StatusToggleProps {
  currentStatus: DriverAvailabilityStatus;
  onStatusChange: (status: DriverAvailabilityStatus) => void;
  isLoading?: boolean;
  hasAvailability?: boolean;
  onDisabledClick?: () => void;
}

const statusOptions = [
  {
    value: "Available" as DriverAvailabilityStatus,
    label: "Available",
    icon: <FaCheckCircle className="w-5 h-5" />,
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-400",
    activeText: "text-emerald-700",
    hoverBg: "hover:bg-emerald-100",
  },
  {
    value: "Busy" as DriverAvailabilityStatus,
    label: "Busy",
    icon: <FaHourglassHalf className="w-5 h-5" />,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-400",
    activeText: "text-amber-700",
    hoverBg: "hover:bg-amber-100",
  },
  {
    value: "Offline" as DriverAvailabilityStatus,
    label: "Offline",
    icon: <FaRegCircle className="w-5 h-5" />,
    iconColor: "text-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
    activeBg: "bg-red-50",
    activeBorder: "border-red-400",
    activeText: "text-red-600",
    hoverBg: "hover:bg-red-100",
  },
];

const StatusToggle: React.FC<StatusToggleProps> = ({
  currentStatus,
  onStatusChange,
  isLoading = false,
  hasAvailability = true,
  onDisabledClick,
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<DriverAvailabilityStatus>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusClick = (status: DriverAvailabilityStatus) => {
    if (!hasAvailability) {
      if (onDisabledClick) {
        onDisabledClick();
      }
      return;
    }

    if (!isLoading && status !== selectedStatus) {
      setSelectedStatus(status);
      onStatusChange(status);
    }
  };

  const activeOption = statusOptions.find(
    (opt) => opt.value === selectedStatus
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-gray-900">Change Status</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statusOptions.map((option) => {
          const isSelected = selectedStatus === option.value;
          const isDisabled = !hasAvailability || isLoading;

          return (
            <button
              key={option.value}
              type="button"
              disabled={isDisabled}
              onClick={() => handleStatusClick(option.value)}
              aria-pressed={isSelected}
              className={`
                flex items-center justify-center gap-3
                px-5 py-3.5 rounded-2xl
                transition-all duration-200 ease-out
                font-semibold text-sm
                border-2
                ${option.bg} ${option.text}
                ${
                  isSelected
                    ? `${option.activeBorder} scale-[1.02] shadow-sm`
                    : `border-transparent ${
                        isDisabled ? "" : option.hoverBg + " hover:scale-[1.01]"
                      }`
                }
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
              `}
              title={
                !hasAvailability
                  ? "Create an availability schedule first"
                  : undefined
              }
            >
              <span className={option.iconColor}>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-2">
          <FaHourglassHalf className="w-4 h-4 animate-spin text-amber-500" />
          <span>Updating status...</span>
        </div>
      )}
    </div>
  );
};

export default StatusToggle;
