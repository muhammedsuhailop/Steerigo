import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import {
  FaMapMarkerAlt,
  FaMapPin,
  FaRupeeSign,
  FaClock,
  FaUser,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import type { RideRequestCardProps } from "../types/rideRequests.types";

export const RideRequestCard: React.FC<RideRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}) => {
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = request.expiresAt
    ? new Date(request.expiresAt) < new Date()
    : false;

  const getTimeRemaining = (): string | null => {
    if (!request.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(request.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <Card className="relative overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-xl shadow-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50">
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${isExpired ? "bg-slate-300" : "bg-emerald-500"}`}
      />

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 text-xl shadow-inner border border-blue-100">
              <FaUser />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg font-black tracking-tight text-slate-800">
                {request.rideType}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ID: {request.riderId.slice(0, 8)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-0.5 text-2xl font-black text-emerald-600">
              <FaRupeeSign className="text-sm" />
              {request.fare}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {request.currency}
            </p>
          </div>
        </div>

        {/* Expiry Badge */}
        {timeRemaining && (
          <div
            className={`flex items-center gap-2 p-2 px-3 rounded-xl border ${isExpired ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-amber-50 border-amber-100 text-amber-700 animate-pulse"}`}
          >
            <FaClock size={12} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isExpired ? "Expired" : `Offer expires in ${timeRemaining}`}
            </span>
          </div>
        )}

        {/* Route Section */}
        <div className="relative space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          {/* Pickup */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200 shrink-0">
              <FaMapMarkerAlt size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Pickup
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {request.pickup.address}
              </p>
            </div>
          </div>

          {/* Dotted Vertical Connector */}
          <div className="absolute left-[29px] top-[48px] bottom-[48px] border-l-2 border-dotted border-slate-300 z-0" />

          {/* Drop */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm border border-slate-200 shrink-0">
              <FaMapPin size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Drop
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {request.drop.address}
              </p>
            </div>
          </div>
        </div>

        {/* Time Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Pickup Time
            </p>
            <p className="text-xs font-bold text-slate-700">
              {formatTime(request.pickupTime)}
            </p>
            <p className="text-[10px] text-slate-500">
              {formatDate(request.pickupTime)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Estimated ETA
            </p>
            <p className="text-xs font-bold text-slate-700">
              {request.pickupETA}
            </p>
            <p className="text-[10px] text-slate-500">Approx. Arrival</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onAccept(request.requestId)}
            disabled={isAccepting || isRejecting || isExpired}
            className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAccepting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaCheck /> Accept
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => onReject(request.requestId)}
            disabled={isAccepting || isRejecting || isExpired}
            className="flex-1 h-12 rounded-2xl border-2 border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold text-slate-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRejecting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-rose-600/30 border-t-rose-600" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaTimes /> Reject
              </div>
            )}
          </Button>
        </div>

      </div>
    </Card>
  );
};
