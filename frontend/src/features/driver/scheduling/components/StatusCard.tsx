import React from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCircle,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import Card from "@/shared/components/ui/Card";
import type {
  AvailabilityData,
  DriverAvailabilityStatus,
  TimeSlot,
} from "../types/scheduling.types";
import WeeklyAvailabilityStrip from "./WeeklyAvailabilityStrip";
import ExceptionsPanel from "./ExceptionsPanel";

interface StatusCardProps {
  availabilityStatus: DriverAvailabilityStatus;
  availabilityData: AvailabilityData | null;
}

const statusConfig: Record<
  DriverAvailabilityStatus,
  {
    icon: React.ReactNode;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    label: string;
    description: string;
    badgeVariant: "success" | "warning" | "danger" | "info";
  }
> = {
  Scheduled: {
    icon: <FaCheckCircle />,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    label: "Scheduled",
    description: "Your schedule is set up and ready",
    badgeVariant: "info",
  },
  Available: {
    icon: <FaCheckCircle />,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    label: "Available",
    description: "You are currently available for rides",
    badgeVariant: "success",
  },
  Busy: {
    icon: <FaHourglassHalf />,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    label: "Busy",
    description: "You are currently on a ride",
    badgeVariant: "warning",
  },
  Offline: {
    icon: <FaRegCircle />,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    label: "Offline",
    description: "You are currently offline",
    badgeVariant: "danger",
  },
} as const;

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const StatusCard: React.FC<StatusCardProps> = ({
  availabilityStatus,
  availabilityData,
}) => {
  const config = statusConfig[availabilityStatus];

  if (!availabilityData) {
    return (
      <Card
        className={`${config.bgColor} ${config.borderColor} rounded-2xl p-5`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {config.label}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
          </div>
          <div className={`text-3xl ${config.iconColor}`}>{config.icon}</div>
        </div>
      </Card>
    );
  }

  const { recurringSchedule, summary, currentLocation, exceptions } =
    availabilityData;

  const showDetails =
    availabilityStatus !== "Offline" && availabilityStatus !== "Scheduled";

  return (
    <Card className={`${config.bgColor} ${config.borderColor} rounded-2xl p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${config.textColor}`}>
            {config.label}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        </div>
        <div className={`text-3xl ${config.iconColor}`}>{config.icon}</div>
      </div>

      {/* Scheduled Details */}
      {availabilityStatus === "Scheduled" &&
        recurringSchedule &&
        recurringSchedule.isActive && (
          <div className="space-y-4 mt-6 pt-5 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-gray-600 text-sm" />
                <span className="font-medium text-sm text-gray-700">
                  Recurring Schedule
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-gray-600 text-sm" />
                <span className="font-medium text-sm text-gray-700">
                  Valid Period
                </span>
              </div>

              <div className="text-sm text-gray-600 ml-6 space-y-1">
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {formatTime(recurringSchedule.validity.startDate)}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {formatTime(recurringSchedule.validity.endDate)}
                </p>
              </div>
            </div>

            {recurringSchedule.notes && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Notes:</span>{" "}
                {recurringSchedule.notes}
              </div>
            )}
          </div>
        )}

      {/* Weekly Availability */}
      <div className="mt-6">
        <WeeklyAvailabilityStrip availabilityData={availabilityData} />
      </div>

      {/* Exceptions */}
      {exceptions && <ExceptionsPanel exceptions={exceptions} />}

      {/* Location */}
      {currentLocation && (
        <div className="mt-6 pt-5 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex gap-2">
            <FaMapMarkerAlt className="mt-1" />
            <div>
              <p className="font-medium text-gray-700">Current Location</p>
              <p className="truncate">{currentLocation.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                Updated: {formatTime(currentLocation.lastUpdatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatusCard;
