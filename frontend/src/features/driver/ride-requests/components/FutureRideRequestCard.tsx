import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import {
  FaMapMarkerAlt,
  FaMapPin,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheck,
} from "react-icons/fa";
import type { FutureRideRequestCardProps } from "../types/rideRequests.types";

export const FutureRideRequestCard: React.FC<FutureRideRequestCardProps> = ({
  request,
  onAccept,
  isAccepting,
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

  return (
    <Card className="w-full relative overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
      {/* Top Accent */}
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

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {request.currency}
            </p>
          </div>
        </div>

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
        <Button
          onClick={() => onAccept(request.requestId)}
          disabled={isAccepting}
          className="w-full h-12 rounded-2xl bg-gray-600 hover:bg-gray-700 text-white font-bold shadow-md shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isAccepting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FaCheck />
              Accept Scheduled Ride
            </div>
          )}
        </Button>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          <span>REQ: {request.requestId.slice(0, 12)}</span>
          <span>{pickupInfo.time}</span>
        </div>
      </div>
    </Card>
  );
};
