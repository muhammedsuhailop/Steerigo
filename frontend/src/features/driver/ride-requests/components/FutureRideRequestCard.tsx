import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import {
  FaMapMarkerAlt,
  FaMapPin,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import type { FutureRideRequestCardProps } from "../types/rideRequests.types";

export const FutureRideRequestCard: React.FC<FutureRideRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
  isUnavailable = false,
  isAccepted = false,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    return {
      time: date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),

      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  };

  const pickupInfo = formatDateTime(request.pickupTime);

  const isDisabled = isAccepting || isRejecting || isUnavailable || isAccepted;

  return (
    <Card className="w-full relative overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-500" />

      <div className="p-5 space-y-5 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 text-gray-600 border border-gray-100 flex items-center justify-center text-xl shrink-0">
              <FaCalendarAlt />
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-black tracking-tight text-slate-800 leading-tight">
                Scheduled Request
              </h3>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                ID: {request.requestId.slice(0, 8)}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center justify-end text-2xl font-black text-gray-600 leading-none">
              <FaRupeeSign className="text-sm mr-0.5" />
              {request.fare}
            </div>
          </div>
        </div>

        {isAccepted && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-black self-start">
            <FaCheck />
            Accepted Ride
          </div>
        )}

        {/* Time & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Pickup Time
            </p>

            <p className="text-base font-black text-slate-800">
              {pickupInfo.time}
            </p>

            <p className="text-xs text-slate-500 mt-1">Scheduled Pickup</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Date
            </p>

            <p className="text-base font-black text-slate-800 leading-snug">
              {pickupInfo.date}
            </p>

            <p className="text-xs text-slate-500 mt-1">Ride Schedule</p>
          </div>
        </div>

        {/* Route */}
        <div className="relative space-y-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
          {/* Pickup */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-500 border border-slate-200 shadow-sm shrink-0">
              <FaMapMarkerAlt size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Pickup
              </p>

              <p className="text-sm font-bold text-slate-800 break-words leading-relaxed">
                {request.pickup.address}
              </p>
            </div>
          </div>

          {/* Connector */}
          <div className="absolute left-[39px] top-[52px] bottom-[52px] border-l-2 border-dotted border-slate-300 z-0" />

          {/* Drop */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-rose-500 border border-slate-200 shadow-sm shrink-0">
              <FaMapPin size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Drop
              </p>

              <p className="text-sm font-bold text-slate-800 break-words leading-relaxed">
                {request.drop.address}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-3 mt-2">
          {/* Reject Button */}
          {!isAccepted && !isUnavailable && (
            <Button
              onClick={() => {
                if (isDisabled) return;
                onReject(request.requestId);
              }}
              disabled={isDisabled}
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isRejecting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600/30 border-t-red-600" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaTimes />
                  Reject
                </div>
              )}
            </Button>
          )}

          {/* Accept Button */}
          <Button
            onClick={() => {
              if (isDisabled) return;
              onAccept(request.requestId);
            }}
            disabled={isDisabled}
            className={`
                flex-[2] h-12 rounded-2xl text-white font-bold shadow-md transition-all active:scale-[0.98]
              ${
                isAccepted
                  ? "bg-emerald-500 shadow-emerald-200"
                  : isUnavailable
                    ? "bg-slate-400 shadow-slate-200"
                    : "bg-gray-600 hover:bg-gray-700 shadow-gray-200"
              }
              disabled:opacity-70
            `}
          >
            {isAccepting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaCheck />
                {isAccepted
                  ? "Accepted"
                  : isUnavailable
                    ? "No Longer Available"
                    : "Accept"}
              </div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
