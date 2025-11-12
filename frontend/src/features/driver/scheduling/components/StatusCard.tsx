import React from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Card from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import type { Location } from "../types/scheduling.types";

type DriverStatus = "Available" | "Busy" | "Offline";

interface StatusCardProps {
  availabilityStatus: DriverStatus;
  availableFrom?: string;
  availableTill?: string;
  currentLocation?: Location;
}

const statusConfig = {
  Available: {
    icon: <FaCheckCircle className="w-6 h-6" />,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    label: "Available",
    description: "You are currently available for rides",
    badgeVariant: "success" as const,
  },
  Busy: {
    icon: <FaHourglassHalf className="w-6 h-6" />,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    label: "Busy",
    description: "You are currently on a ride",
    badgeVariant: "warning" as const,
  },
  Offline: {
    icon: <FaRegCircle className="w-6 h-6" />,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    label: "Offline",
    description: "You are currently offline",
    badgeVariant: "danger" as const,
  },
} as const;

function formatTime(iso?: string) {
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
  availableFrom,
  availableTill,
  currentLocation,
}) => {
  const config = statusConfig[availabilityStatus];

  const cardClassName = `${config.bgColor} ${config.borderColor} rounded-2xl`;
  const showDetails = availabilityStatus !== "Offline";

  return (
    <Card className={cardClassName}>
      <Card.Header title={`Current Status: `} className="p-3">
        <Badge variant={config.badgeVariant} size="sm" className="ml-2">
          {config.label}
        </Badge>

        <div className={`${config.iconColor} ml-2`} aria-hidden>
          {config.icon}
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`${config.iconColor} text-2xl`}>{config.icon}</div>
          <p className={`text-sm ${config.textColor} opacity-95`}>
            {config.description}
          </p>
        </div>

        {showDetails && (
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <span className="font-semibold text-slate-600">
                Available From:
              </span>{" "}
              <span className="text-slate-700">
                {formatTime(availableFrom)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">
                Available Till:
              </span>{" "}
              <span className="text-slate-700">
                {formatTime(availableTill)}
              </span>
            </div>
          </div>
        )}
      </Card.Body>

      {showDetails && (
        <Card.Footer className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-slate-500" />
          <span className="font-semibold text-slate-600">Location:</span>
          <span className="text-slate-700">
            {currentLocation?.address ?? "—"}
          </span>
        </Card.Footer>
      )}
    </Card>
  );
};

export default StatusCard;
