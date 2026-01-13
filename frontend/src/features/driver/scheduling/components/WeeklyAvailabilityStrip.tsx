import React from "react";
import { AvailabilityData } from "../types/scheduling.types";
import { getNext7DaysAvailability } from "../../shared/utils/availability.utils";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  availabilityData: AvailabilityData;
}

/** Convert ISO → local readable date */
function formatLocalDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const WeeklyAvailabilityStrip: React.FC<Props> = ({ availabilityData }) => {
  const days = getNext7DaysAvailability(availabilityData);

  const validity = availabilityData.recurringSchedule?.validity;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Weekly Availability
        </h4>

        {/* Validity range (non-intrusive) */}
        {validity && (
          <p className="text-xs text-gray-500 mt-1">
            Available from{" "}
            <span className="font-medium text-gray-600">
              {formatLocalDate(validity.startDate)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-600">
              {formatLocalDate(validity.endDate)}
            </span>
          </p>
        )}
      </div>

      {/* Week row */}
      <div className="flex justify-between gap-3">
        {days.map((d, idx) => {
          const day = d.date.toLocaleDateString("en-IN", { weekday: "short" });
          const date = d.date.getDate();

          return (
            <div
              key={idx}
              className={`
                flex-1
                min-w-0
                rounded-2xl
                px-3 py-4
                text-center
                transition-all
                ${
                  d.isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }
              `}
            >
              <div className="text-xs font-medium uppercase">{day}</div>
              <div className="text-xl font-bold mt-1">{date}</div>

              <div className="mt-2 flex justify-center">
                {d.isAvailable ? (
                  <FaCheckCircle className="text-emerald-600" />
                ) : (
                  <FaTimesCircle className="text-amber-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyAvailabilityStrip;
