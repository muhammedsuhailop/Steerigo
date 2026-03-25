import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaCircle,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { UserRide } from "../types/userRides.types";
import { RideStatus } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";

interface UserRideCardProps {
  ride: UserRide;
}

export const UserRideCard: React.FC<UserRideCardProps> = ({ ride }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status?: RideStatus) => {
    switch (status) {
      case RideStatus.COMPLETED:
        return "success";
      case RideStatus.CANCELLED:
      case RideStatus.REJECTED:
        return "danger";
      case RideStatus.STARTED:
      case RideStatus.ACCEPTED:
      case RideStatus.ARRIVED:
        return "info";
      default:
        return "warning";
    }
  };

  const getPaymentVariant = (status?: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return "success";
      case PaymentStatus.FAILED:
        return "danger";
      case PaymentStatus.REFUNDED:
      case PaymentStatus.PARTIALLY_REFUNDED:
        return "secondary";
      default:
        return "warning";
    }
  };

  const formattedDate = ride.timeline?.requestedAt
    ? new Date(ride.timeline.requestedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "-- --";

  return (
    <Card
      onClick={() => navigate(`/ride/${ride.rideId}`)}
      className="group border border-slate-100 bg-white hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-2xl overflow-hidden mb-4 cursor-pointer active:scale-[0.99]"
    >
      <div className="flex flex-col md:flex-row items-stretch p-4 md:p-5 gap-6">
        {/* Id & Date Block */}
        <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2 md:min-w-[120px] md:border-r border-slate-50 md:pr-6">
          <div className="flex items-center gap-2 text-slate-400">
            <FaCalendarAlt size={12} />
            <span className="text-xs font-bold tracking-tight">
              {formattedDate}
            </span>
          </div>
          <div className="flex flex-col md:mt-1">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
              #{ride.rideId?.slice(-6).toUpperCase()}
            </span>
            <Badge
              variant="secondary"
              className="mt-1 text-[9px] px-2 py-0 bg-slate-100 text-slate-500 border-none font-bold lowercase italic"
            >
              {ride.rideType || "Trip"}
            </Badge>
          </div>
        </div>

        {/* Route Block */}
        <div className="flex-1 relative flex flex-col justify-center gap-3 min-w-0">
          <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[1.5px] bg-slate-100" />

          <div className="flex items-center gap-4 relative z-10">
            <FaCircle className="text-emerald-500 bg-white" size={14} />
            <p className="text-sm font-medium text-slate-600 truncate flex-1">
              {ride.pickup?.address || "Pickup location unavailable"}
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <FaCircle className="text-slate-300 bg-white" size={14} />
            <p className="text-sm font-medium text-slate-600 truncate flex-1">
              {ride.drop?.address || "Destination unavailable"}
            </p>
          </div>
        </div>

        {/* Status & Fare Block */}
        <div className="flex items-center justify-between md:justify-end gap-8 md:min-w-[280px] bg-slate-50/50 md:bg-transparent -mx-4 -mb-4 p-4 md:m-0 md:p-0 border-t md:border-none border-slate-100">
          {/* Fare */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">
              Trip Fare
            </span>
            <p className="text-lg font-black text-slate-900 leading-none">
              {ride.currency?.toUpperCase() === "INR"
                ? "₹"
                : ride.currency || "₹"}
              {ride.fare?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Status Stack */}
          <div className="flex flex-col gap-2 min-w-[110px]">
            {/* Ride Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase"></span>
              <Badge
                variant={getStatusVariant(ride.status)}
                className="text-[9px] px-2 py-0 h-5 min-w-[70px] justify-center font-bold border-none shadow-sm"
              >
                {ride.status || "Pending"}
              </Badge>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Payment
              </span>
              <Badge
                variant={getPaymentVariant(ride.paymentStatus)}
                className="text-[9px] px-2 py-0 h-5 min-w-[70px] justify-center font-bold border-none shadow-sm gap-1 opacity-90"
              >
                {ride.paymentStatus === PaymentStatus.SUCCESS ? (
                  <FaCheckCircle size={8} />
                ) : (
                  <FaBan size={8} className="rotate-90" />
                )}
                {ride.paymentStatus?.replace(/_/g, " ").toLowerCase() ||
                  "Pending"}
              </Badge>
            </div>
          </div>

          {/* Desktop Only Arrow */}
          <div className="hidden md:flex w-10 h-10 rounded-2xl bg-white text-slate-300 group-hover:bg-slate-900 group-hover:text-white items-center justify-center transition-all duration-300 shadow-sm border border-slate-100">
            <FaArrowRight size={12} />
          </div>
        </div>
      </div>
    </Card>
  );
};
