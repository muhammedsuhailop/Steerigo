import React from "react";
import { useNavigate } from "react-router-dom";
import { Ride } from "../types/driverRides.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import { RideStatus } from "@/shared/types/ride.types";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

interface RideCardProps {
  ride: Ride;
}

export const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const navigate = useNavigate();

  const getRideState = (status?: RideStatus) => {
    switch (status) {
      case RideStatus.REQUESTED:
        return {
          label: "Looking for driver",
          tone: "bg-amber-50 text-amber-600",
          border: "bg-amber-500",
        };
      case RideStatus.ACCEPTED:
        return {
          label: "Driver assigned",
          tone: "bg-blue-50 text-blue-600",
          border: "bg-blue-500",
        };
      case RideStatus.ARRIVED:
        return {
          label: "Driver arrived",
          tone: "bg-indigo-50 text-indigo-600",
          border: "bg-indigo-500",
        };
      case RideStatus.STARTED:
        return {
          label: "Trip in progress",
          tone: "bg-purple-50 text-purple-600",
          border: "bg-purple-500",
        };
      case RideStatus.COMPLETED:
        return {
          label: "Completed",
          tone: "bg-emerald-50 text-emerald-600",
          border: "bg-emerald-500",
        };
      case RideStatus.CANCELLED:
        return {
          label: "Cancelled",
          tone: "bg-red-50 text-red-600",
          border: "bg-red-500",
        };
      case RideStatus.REJECTED:
        return {
          label: "Rejected",
          tone: "bg-slate-100 text-slate-500",
          border: "bg-slate-400",
        };
      default:
        return {
          label: "Unknown",
          tone: "bg-slate-100 text-slate-500",
          border: "bg-slate-300",
        };
    }
  };

  const getPaymentState = (status?: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return { label: "Paid", tone: "text-emerald-600" };
      case PaymentStatus.PENDING:
        return { label: "Pending", tone: "text-amber-600" };
      case PaymentStatus.FAILED:
        return { label: "Failed", tone: "text-red-600" };
      case PaymentStatus.REFUNDED:
        return { label: "Refunded", tone: "text-blue-600" };
      case PaymentStatus.PARTIALLY_REFUNDED:
        return { label: "Partial refund", tone: "text-indigo-600" };
      default:
        return { label: "Unpaid", tone: "text-slate-500" };
    }
  };

  const currencySymbol =
    ride.currency?.toUpperCase() === "INR" ? "₹" : ride.currency || "₹";

  const rideState = getRideState(ride.status);
  const paymentState = getPaymentState(ride.paymentStatus);

  return (
    <div
      onClick={() => navigate(`/driver/ride/${ride.rideId}`)}
      className="relative group cursor-pointer bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${rideState.border} transition-all duration-300 group-hover:w-1.5`}
      />

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400 font-medium break-all">
          {ride.rideId || "No Ride ID"}
        </p>

        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${rideState.tone}`}
        >
          {rideState.label}
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
          <MdLocationOn className="text-emerald-500 text-base flex-shrink-0" />
          <span className="truncate">
            {ride.pickup?.address || "Pickup not set"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
          <FaMapMarkerAlt className="text-rose-500 text-sm flex-shrink-0" />
          <span className="truncate">
            {ride.drop?.address ||
              ride.pickup?.address ||
              "Destination not set"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-slate-900">
            {currencySymbol} {ride.fare?.toLocaleString() || "0"}
          </span>
          <span className="text-xs text-slate-400">
            {ride.timeline?.requestedAt
              ? new Date(ride.timeline.requestedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                  },
                )
              : "No date"}
          </span>
        </div>

        <div className="text-right">
          <p className={`text-sm font-medium ${paymentState.tone}`}>
            {paymentState.label}
          </p>
          <p className="text-xs text-slate-400">
            {ride.rideType || "Standard"}
          </p>
        </div>
      </div>
    </div>
  );
};
