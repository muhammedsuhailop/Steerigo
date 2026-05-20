import React from "react";
import {
  FaCalendarAlt,
  FaCar,
  FaClock,
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
        title: "We couldn't match your ride",
        description:
          "No nearby drivers were available for your scheduled ride request.",
      };
    }

    return {
      badge: "Searching Drivers",
      title: "Finding nearby drivers",
      description:
        "Nearby drivers have received your request. Your ride will be confirmed automatically once a driver accepts.",
    };
  };

  const { badge, title, description } = getHeaderContent();

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* HERO SECTION */}
      <div className="relative border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white px-6 py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isFailed
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isFailed ? "bg-red-500" : "bg-amber-500 animate-pulse"
                }`}
              />

              {badge}
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          </div>

          {!isFailed && (
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
              <FaCar className="text-lg text-amber-700" />
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {!isFailed && (
          <div className="mt-7 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* FARE */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Estimated Fare
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ₹{estimatedFare?.toFixed(0) || "--"}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-gray-500">
                  Final trip charges depend on the actual trip duration and will
                  be finalized after the ride is completed.
                </p>
              </div>

              {/* DETAILS */}
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCar className="text-gray-400" />

                  <span>
                    <span className="font-semibold text-gray-900">
                      {response.data.totalDriversNotified}
                    </span>{" "}
                    driver
                    {response.data.totalDriversNotified > 1 ? "s" : ""} notified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />

                  <span>
                    {new Date(response.data.pickupTime).toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />

                  <span>
                    {formData?.timeRequired || "--"} hrs required duration
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TRIP TIMELINE */}
      <div className="px-6 py-6">
        <div className="relative">
          {/* LINE */}
          {formData?.dropLocation && (
            <div className="absolute left-[18px] top-10 bottom-10 w-[2px] bg-gray-200" />
          )}

          {/* PICKUP */}
          <div className="relative flex gap-4">
            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <FaMapMarkerAlt className="text-sm" />
            </div>

            <div className="pb-8">
              <p className="text-sm font-semibold text-gray-900">Pickup</p>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {formData?.pickupLocation?.address || "--"}
              </p>
            </div>
          </div>

          {/* DROP */}
          {formData?.dropLocation && (
            <div className="relative flex gap-4">
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                <FaMapMarkerAlt className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">Drop</p>

                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {formData.dropLocation.address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      {!isFailed && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={isCancelling}
              onClick={onCancelRequest}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaTimes className="text-xs" />

              {isCancelling ? "Cancelling..." : "Cancel Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FutureRideSuccessCard;
