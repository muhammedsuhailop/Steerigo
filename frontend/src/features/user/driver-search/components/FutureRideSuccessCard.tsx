import React from "react";
import {
  FaCalendarAlt,
  FaCar,
  FaClock,
  FaHourglassHalf,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

import { FutureScheduleResponse } from "../types/rideRequest.types";
import { TripFormData } from "../types/driverSearch.types";

interface FutureRideSuccessCardProps {
  response: FutureScheduleResponse;
  formData: TripFormData | null;
  onCancelRequest: () => void;
  isCancelling?: boolean;
  isExpired?: boolean;
  isAllRejected?: boolean;
}

const FutureRideSuccessCard: React.FC<FutureRideSuccessCardProps> = ({
  response,
  formData,
  onCancelRequest,
  isCancelling = false,
  isExpired = false,
  isAllRejected = false,
}) => {
  const estimatedFare = response.data?.scheduledRequests?.[0]?.totalFare;
  const currency = response.data?.scheduledRequests?.[0]?.currency || "INR";

  const isFailed = isExpired || isAllRejected;

  const getHeaderContent = () => {
    if (isExpired) {
      return {
        badge: "Request Expired",
        title: "Unable to find a driver",
        description:
          "Your scheduled ride request expired before a driver could accept it.",
      };
    }
    if (isAllRejected) {
      return {
        badge: "No Drivers Available",
        title: "We couldn't match your scheduled ride",
        description:
          "No nearby drivers were available for your scheduled ride request. Please try again later.",
      };
    }
    return {
      badge: "Request Sent",
      title: "Waiting for driver confirmation",
      description:
        "Nearby drivers have received your ride request. Once a driver accepts, your ride will be confirmed automatically.",
    };
  };

  const { badge, title, description } = getHeaderContent();

  return (
    <div className="bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 border ${
              isFailed
                ? "bg-red-50 border-red-100"
                : "bg-amber-50 border-amber-100"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isFailed ? "bg-red-500" : "bg-amber-500 animate-pulse"
              }`}
            />

            <span
              className={`text-xs font-semibold ${
                isFailed ? "text-red-700" : "text-amber-700"
              }`}
            >
              {badge}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-xl">
            {description}
          </p>
        </div>

        <div
          className={`hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
            isFailed
              ? "bg-red-50 border-red-100"
              : "bg-amber-50 border-amber-100"
          }`}
        >
          <FaHourglassHalf
            className={`text-xl ${
              isFailed ? "text-red-600" : "text-amber-600 animate-pulse"
            }`}
          />
        </div>
      </div>

      {!isFailed && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FARE */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
              Estimated Fare
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                ₹{estimatedFare?.toFixed(0) || "--"}
              </span>

              <span className="pb-1 text-sm text-gray-500">{currency}</span>
            </div>
          </div>

          {/* DRIVERS */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
              Drivers Notified
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FaCar />
              </div>

              <div>
                <p className="text-3xl font-bold tracking-tight text-gray-900">
                  {response.data.totalDriversNotified}
                </p>

                <p className="text-xs text-gray-500">Requests sent</p>
              </div>
            </div>
          </div>

          {/* PICKUP TIME */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FaCalendarAlt />
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
                  Pickup Time
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {new Date(response.data.pickupTime).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* DURATION */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FaClock />
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
                  Required Duration
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                  {formData?.timeRequired || "--"} hrs
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATIONS */}
      <div className="mt-5 space-y-4">
        {/* PICKUP */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex gap-4">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <FaMapMarkerAlt />
            </div>

            <div>
              <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
                Pickup Location
              </p>

              <p className="mt-1 text-sm font-medium leading-relaxed text-gray-900">
                {formData?.pickupLocation?.address || "--"}
              </p>
            </div>
          </div>
        </div>

        {/* DROP */}
        {formData?.dropLocation && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <FaMapMarkerAlt />
              </div>

              <div>
                <p className="text-[11px] tracking-[0.15em] font-semibold text-gray-500">
                  Drop Location
                </p>

                <p className="mt-1 text-sm font-medium leading-relaxed text-gray-900">
                  {formData.dropLocation.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div></div>

        {!isFailed && (
          <button
            type="button"
            disabled={isCancelling}
            onClick={onCancelRequest}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTimes />
            {isCancelling ? "Cancelling..." : "Cancel Request"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FutureRideSuccessCard;
