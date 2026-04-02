import React from "react";
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdErrorOutline,
} from "react-icons/md";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import { TimelineDetails } from "../types/ride-details.types";

interface TimelineStepProps {
  label: string;
  time?: string;
  isCompleted: boolean;
  isError?: boolean;
  isLast?: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  label,
  time,
  isCompleted,
  isError,
  isLast,
}) => (
  <div className="flex gap-4 min-h-[70px]">
    <div className="flex flex-col items-center">
      <div
        className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${
          isError
            ? "border-red-500 text-red-500"
            : isCompleted
              ? "border-blue-600 text-blue-600"
              : "border-gray-200 text-gray-300"
        }`}
      >
        {isError ? (
          <MdErrorOutline size={14} />
        ) : isCompleted ? (
          <MdCheckCircle size={14} />
        ) : (
          <MdRadioButtonUnchecked size={14} />
        )}
      </div>
      {!isLast && (
        <div
          className={`w-[2px] grow ${isCompleted ? "bg-blue-600" : "bg-gray-100"}`}
        />
      )}
    </div>
    <div className="pb-6">
      <p
        className={`text-xs font-black uppercase tracking-wider ${
          isError
            ? "text-red-600"
            : isCompleted
              ? "text-gray-900"
              : "text-gray-400"
        }`}
      >
        {label}
      </p>
      {time && (
        <p className="mt-1 text-[10px] font-medium text-gray-500">
          {Formatters.formatDate(time, { includeTime: true })}
        </p>
      )}
    </div>
  </div>
);

export const RideTimeline: React.FC<{ timeline: TimelineDetails }> = ({
  timeline,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-8 pb-2 border-b border-gray-100">
        <span className="text-blue-600 text-sm font-black uppercase tracking-widest">
          Trip Timeline
        </span>
      </div>

      <div className="flex flex-col">
        <TimelineStep
          label="Ride Requested"
          time={timeline.requestedAt}
          isCompleted={true}
        />

        {timeline.rejectedAt ? (
          <TimelineStep
            label="Rejected by Driver"
            time={timeline.rejectedAt}
            isCompleted={true}
            isError={true}
            isLast
          />
        ) : (
          <>
            <TimelineStep
              label="Accepted"
              time={timeline.acceptedAt}
              isCompleted={!!timeline.acceptedAt}
            />
            <TimelineStep
              label="Driver Arrived"
              time={timeline.arrivedAt}
              isCompleted={!!timeline.arrivedAt}
            />
            <TimelineStep
              label="Ride Started"
              time={timeline.startedAt}
              isCompleted={!!timeline.startedAt}
            />

            {timeline.cancelledAt ? (
              <TimelineStep
                label="Ride Cancelled"
                time={timeline.cancelledAt}
                isCompleted={true}
                isError={true}
                isLast
              />
            ) : (
              <TimelineStep
                label="Ride Completed"
                time={timeline.completedAt}
                isCompleted={!!timeline.completedAt}
                isLast
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
