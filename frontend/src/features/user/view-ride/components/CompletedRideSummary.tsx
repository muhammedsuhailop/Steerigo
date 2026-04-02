import React from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaTimesCircle,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { RideStatus, RideTimeline } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import { DriverInfo, RideDetails } from "../types/viewRide.types";
import FareBreakdown from "./FareBreakdown";
import RideTimelineExpandable from "./RideTimelineExpandable";
import HorizontalDriverCard from "./HorizontalDriverCard";
import { usePayment } from "../hooks/usePayment";
import RideRating from "./RideRating";
import CouponSection from "./CouponSection";

interface CompletedRideSummaryProps {
  activeRide: RideDetails;
  driver?: DriverInfo | null;
  user: { name: string; email: string };
}

const CompletedRideSummary: React.FC<CompletedRideSummaryProps> = ({
  activeRide,
  driver,
  user,
}) => {
  const {
    rideId,
    fare,
    timeline,
    pickup,
    drop,
    distance,
    status,
    paymentStatus,
  } = activeRide;
  const { handlePayment, isLoading } = usePayment();

  const isCompleted = status === RideStatus.COMPLETED;
  const needsPayment =
    isCompleted &&
    (!paymentStatus ||
      paymentStatus === PaymentStatus.FAILED ||
      paymentStatus === PaymentStatus.PENDING);

  const isEligibleForRating =
    status === RideStatus.COMPLETED && paymentStatus === PaymentStatus.SUCCESS;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4">
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-6 p-4 rounded-full ${isCompleted ? "bg-green-50" : "bg-red-50"}`}
        >
          {isCompleted ? (
            <FaCheckCircle className="text-green-500 text-5xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-5xl" />
          )}
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          {isCompleted ? "Trip Summary" : "Ride Ended"}
        </h2>
        <p className="text-gray-400 font-semibold tracking-widest uppercase text-xs flex items-center gap-2 mt-2">
          <FaCalendarAlt />{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          • ID: {rideId.slice(-6).toUpperCase()}
        </p>
      </div>

      {needsPayment && (
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[3rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
              <FaCreditCard className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                Amount to Pay
              </p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">
                ₹{fare.payableAmount.toFixed(2)}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <button
              onClick={() => handlePayment({ rideId, user })}
              disabled={isLoading}
              className="px-12 py-4 bg-black text-white rounded-2xl font-black text-base flex items-center gap-3 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Pay Online"}
            </button>
            <p className="text-[10px] font-bold text-gray-300 italic">
              Or pay by cash directly to the driver
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:auto-rows-fr">
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 flex flex-col h-full">
          <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">
            Pickup $ Drop
          </h4>
          <div className="relative space-y-12 flex-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-px border-l-2 border-dashed border-gray-100" />
            <div className="flex gap-8 relative z-10">
              <div className="w-8 h-8 rounded-full bg-black border-4 border-white shadow-lg flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Pickup
                </p>
                <p className="text-base font-bold text-gray-900 leading-tight">
                  {pickup.address}
                </p>
              </div>
            </div>
            <div className="flex gap-8 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center">
                <FaMapMarkerAlt className="text-gray-900 text-xs" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Dropoff
                </p>
                <p className="text-base font-bold text-gray-900 leading-tight">
                  {drop.address}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                Total Distance
              </p>
              <p className="text-2xl font-black text-gray-900">
                {distance.toFixed(2)}{" "}
                <span className="text-sm font-bold text-gray-400">km</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                Type
              </p>
              <p className="text-lg font-bold text-gray-900">One Way</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 flex flex-col h-full">
          <FareBreakdown fare={fare} paymentStatus={paymentStatus} />
          <CouponSection
            rideId={activeRide.rideId}
            status={activeRide.status as RideStatus}
            paymentStatus={activeRide.paymentStatus}
            couponDetails={activeRide.couponDetails}
          />
        </div>
      </div>

      {driver && <HorizontalDriverCard driver={driver} />}

      <RideTimelineExpandable timeline={timeline} />

      {isEligibleForRating && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <RideRating rideId={rideId} existingRating={activeRide?.rating} />
        </div>
      )}
    </div>
  );
};

export default CompletedRideSummary;
