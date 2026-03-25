import { RideTimeline } from "@/shared/types/ride.types";
import React from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { MdRadioButtonChecked } from "react-icons/md";

interface TimelineStepProps {
  label: string;
  description?: string;
  time?: Date | string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
  isError?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  label,
  description,
  time,
  isCompleted,
  isActive,
  isLast,
  isError,
}) => {
  return (
    <div className="flex gap-4">
      {/* Icon & Connector Line */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            isCompleted
              ? "border-green-500 bg-green-50 text-green-600"
              : isError
                ? "border-red-500 bg-red-50 text-red-600"
                : isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "border-gray-200 bg-white text-gray-300"
          }`}
        >
          {isCompleted ? (
            <FaCheckCircle size={16} />
          ) : isError ? (
            <FaTimesCircle size={16} />
          ) : isActive ? (
            <MdRadioButtonChecked size={20} className="animate-pulse" />
          ) : (
            <FaRegCircle size={12} />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 transition-colors duration-500 ${
              isCompleted ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </div>

      {/* Text Content */}
      <div className="pb-8">
        <p
          className={`text-sm font-bold transition-colors ${
            isActive
              ? "text-blue-600"
              : isCompleted
                ? "text-gray-900"
                : isError
                  ? "text-red-600"
                  : "text-gray-400"
          }`}
        >
          {label}
        </p>

        {time && (
          <p className="text-[10px] font-bold text-gray-400 mt-0.5 flex items-center gap-1">
            <FaClock size={10} />
            {new Date(time).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        )}

        {description && (isActive || isError) && (
          <p
            className={`mt-1.5 text-xs leading-relaxed max-w-xs ${isError ? "text-red-500" : "text-gray-500"}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export const RideTimelineStatus: React.FC<{ timeline: RideTimeline }> = ({
  timeline,
}) => {
  const steps = [
    {
      label: "Request Placed",
      time: timeline.requestedAt,
      isCompleted: !!timeline.acceptedAt,
      isActive:
        !timeline.acceptedAt && !timeline.cancelledAt && !timeline.rejectedAt,
      description: "Waiting for a driver to accept your request...",
    },
    {
      label: "Driver Assigned",
      time: timeline.acceptedAt,
      isCompleted: !!timeline.arrivedAt,
      isActive: !!timeline.acceptedAt && !timeline.arrivedAt,
      description: "Your driver is heading to your location.",
    },
    {
      label: "Driver Arrived",
      time: timeline.arrivedAt,
      isCompleted: !!timeline.startedAt,
      isActive: !!timeline.arrivedAt && !timeline.startedAt,
      description: "Your driver is at the pickup location.",
    },
    {
      label: "Trip in Progress",
      time: timeline.startedAt,
      isCompleted: !!timeline.completedAt,
      isActive: !!timeline.startedAt && !timeline.completedAt,
      description: "You are on your way to the destination.",
    },
    {
      label: "Arrived at Destination",
      time: timeline.completedAt,
      isCompleted: !!timeline.paymentCompletedAt,
      isActive:
        !!timeline.completedAt &&
        !timeline.paymentCompletedAt &&
        !timeline.paymentFailedAt,
      description: "Trip finished. Please proceed with payment.",
    },
    {
      label: timeline.paymentFailedAt ? "Payment Failed" : "Payment Completed",
      time: timeline.paymentCompletedAt || timeline.paymentFailedAt,
      isCompleted: !!timeline.paymentCompletedAt,
      isActive:
        !!timeline.paymentInitiatedAt &&
        !timeline.paymentCompletedAt &&
        !timeline.paymentFailedAt,
      isError: !!timeline.paymentFailedAt,
      description: timeline.paymentFailedAt
        ? "The payment attempt was unsuccessful. Please try again."
        : undefined,
      isLast: true,
    },
  ];

  const isCancelled = !!timeline.cancelledAt;
  const isRejected = !!timeline.rejectedAt;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
          <FaClock className="text-gray-300" />
          Ride Timeline
        </h3>
      </div>

      <div className="flex flex-col ml-1">
        {isCancelled || isRejected ? (
          <TimelineStep
            label={isCancelled ? "Ride Cancelled" : "Ride Rejected"}
            time={timeline.cancelledAt || timeline.rejectedAt}
            isCompleted={false}
            isActive={false}
            isError={true}
            isLast={true}
            description={
              isCancelled
                ? "This ride was cancelled."
                : "The driver declined this request."
            }
          />
        ) : (
          steps.map((step, idx) => <TimelineStep key={idx} {...step} />)
        )}
      </div>
    </div>
  );
};
