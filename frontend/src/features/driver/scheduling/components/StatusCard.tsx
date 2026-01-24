import React from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCircle,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import Card from "@/shared/components/ui/Card";
import type {
  AvailabilityData,
  DriverAvailabilityStatus,
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
    colorClass: string;
    borderClass: string;
    bgClass: string;
    label: string;
    description: string;
  }
> = {
  Scheduled: {
    icon: <FaCalendarAlt />,
    colorClass: "text-gray-600",
    borderClass: "border-gray-200",
    bgClass: "bg-gray-50",
    label: "Scheduled",
    description: "Scheduled for upcoming hours",
  },
  Available: {
    icon: <FaCheckCircle />,
    colorClass: "text-emerald-600",
    borderClass: "border-emerald-200",
    bgClass: "bg-emerald-50",
    label: "Available",
    description: "Actively accepting new ride requests",
  },
  Busy: {
    icon: <FaHourglassHalf />,
    colorClass: "text-amber-600",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50",
    label: "Busy",
    description: "Currently on a trip",
  },
  Offline: {
    icon: <FaRegCircle />,
    colorClass: "text-slate-400",
    borderClass: "border-slate-200",
    bgClass: "bg-slate-50",
    label: "Offline",
    description: "Not available for rides",
  },
} as const;

const formatTime = (iso?: string) =>
  !iso
    ? "—"
    : new Date(iso).toLocaleString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        day: "2-digit",
        month: "short",
      });

const formatSimpleTime = (time?: string) => {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateOnly = (iso?: string) =>
  !iso
    ? "—"
    : new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

const StatusCard: React.FC<StatusCardProps> = ({
  availabilityStatus,
  availabilityData,
}) => {
  const config = statusConfig[availabilityStatus];

  return (
    <Card className="relative overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-xl shadow-slate-200/50">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 `} />

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-2 w-2 rounded-full ${config.colorClass.replace("text", "bg")} animate-pulse`}
              />
              <h3 className={`text-lg font-bold tracking-tight text-slate-800`}>
                {config.label}
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {config.description}
            </p>
          </div>
          <div
            className={`p-3 rounded-2xl ${config.bgClass} ${config.colorClass} text-xl shadow-inner`}
          >
            {config.icon}
          </div>
        </div>

        {availabilityData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Scheduled Details Group */}
            {availabilityStatus === "Scheduled" &&
              availabilityData.recurringSchedule?.validity && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <FaCalendarAlt /> Validity Period
                    </div>
                    <div className="text-xs font-bold text-slate-700 space-y-1">
                      <p className="flex justify-between">
                        <span>Start:</span>{" "}
                        <span className="text-slate-900">
                          {formatDateOnly(
                            availabilityData.recurringSchedule.validity
                              .startDate,
                          )}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>End:</span>{" "}
                        <span className="text-slate-900">
                          {formatDateOnly(
                            availabilityData.recurringSchedule.validity.endDate,
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {availabilityData.recurringSchedule.dailyRecurrence?.timeSlots
                    ?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <FaClock /> Shift Window
                      </div>
                      <div className="text-xs font-bold text-gray-700">
                        {availabilityData.recurringSchedule.dailyRecurrence.timeSlots.map(
                          (slot, i) => (
                            <p key={i}>
                              {formatSimpleTime(slot.startTime)} —{" "}
                              {formatSimpleTime(slot.endTime)}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Weekly Strip */}
            <div className="space-y-3">
              <WeeklyAvailabilityStrip availabilityData={availabilityData} />
            </div>

            {/* Exceptions Panel */}
            <div className="pt-2">
              <ExceptionsPanel exceptions={availabilityData.exceptions} />
            </div>

            {/* Location Footer */}
            {availabilityData.currentLocation && (
              <div className="pt-5 border-t border-slate-100">
                <div className="flex gap-4 items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-slate-200">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Current Location
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {availabilityData.currentLocation.address}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Last sync:{" "}
                      {formatTime(
                        availabilityData.currentLocation.lastUpdatedAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {availabilityData?.recurringSchedule?.notes && (
          <div className="flex gap-2 items-start p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <FaInfoCircle
              className="text-amber-500 mt-0.5 shrink-0"
              size={12}
            />
            <p className="text-xs text-amber-800 leading-relaxed italic">
              "{availabilityData.recurringSchedule.notes}"
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatusCard;
