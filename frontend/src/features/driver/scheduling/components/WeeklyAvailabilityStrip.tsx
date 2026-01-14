import React from "react";
import { AvailabilityData } from "../types/scheduling.types";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  availabilityData: AvailabilityData;
}

function formatLocalDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const startOfUTCDay = (d: Date): Date => {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
};

function getNext7DaysAvailability(
  availabilityData: AvailabilityData
): { date: Date; isAvailable: boolean }[] {
  const result: { date: Date; isAvailable: boolean }[] = [];
  const today = new Date();

  const recurring = availabilityData.recurringSchedule;
  if (!recurring) return result;

  const { validity, dailyRecurrence } = recurring;
  if (!validity?.startDate || !validity?.endDate) return result;

  const start = startOfUTCDay(new Date(validity.startDate)).getTime();
  const end = startOfUTCDay(new Date(validity.endDate)).getTime();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateUTC = startOfUTCDay(date).getTime();
    const weekday = date.getUTCDay(); // 0–6

    const isWithinValidity = dateUTC >= start && dateUTC <= end;
    const isDaySelected = dailyRecurrence.daysOfWeek.includes(weekday);

    result.push({
      date,
      isAvailable: isWithinValidity && isDaySelected,
    });
  }

  return result;
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

        {/* Validity range */}
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
          const day = d.date.toLocaleDateString("en-IN", {
            weekday: "short",
          });
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
