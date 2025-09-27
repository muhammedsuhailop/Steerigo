import React from "react";
import { Button } from "@/shared/components/ui";
import type { DriverActionsProps } from "./DriverActions.types";
import {
  RiSignalWifiLine,
  RiSignalWifiOffLine,
  RiCalendarLine,
  RiWalletLine,
} from "react-icons/ri";

export const DriverActions: React.FC<DriverActionsProps> = ({
  isOnline,
  onGoOnline,
  onScheduleAvailability,
  onViewEarnings,
  loading = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Button
        onClick={onGoOnline}
        disabled={loading}
        variant={isOnline ? "danger" : "primary"}
        className="flex-1 py-3"
        leftIcon={
          isOnline ? (
            <RiSignalWifiOffLine className="w-5 h-5" />
          ) : (
            <RiSignalWifiLine className="w-5 h-5" />
          )
        }
      >
        {isOnline ? "Go Offline" : "Go Online"}
      </Button>

      <Button
        onClick={onScheduleAvailability}
        disabled={loading || !isOnline}
        variant="outline"
        className="flex-1 py-3"
        leftIcon={<RiCalendarLine className="w-5 h-5" />}
      >
        Schedule Availability
      </Button>

      <Button
        onClick={onViewEarnings}
        disabled={loading}
        variant="success"
        className="flex-1 py-3"
        leftIcon={<RiWalletLine className="w-5 h-5" />}
      >
        View Earnings
      </Button>
    </div>
  );
};
