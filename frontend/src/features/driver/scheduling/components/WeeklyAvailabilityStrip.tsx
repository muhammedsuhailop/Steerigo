import React, { useState } from "react";
import { AvailabilityData, Exception } from "../types/scheduling.types";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

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

function formatTimeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const startOfUTCDay = (d: Date): Date => {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
};

type DayStatus = "available" | "unavailable" | "partial";

interface DayAvailability {
  date: Date;
  status: DayStatus;
  exceptions: Exception[];
  exceptionHours: number;
  workHours: number;
}

function getWorkHours(availability: AvailabilityData): number {
  const slots =
    availability.recurringSchedule?.dailyRecurrence?.timeSlots || [];
  return slots.reduce((sum, s) => sum + s.durationMinutes / 60, 0);
}

function getExceptionHours(exceptions: Exception[]): number {
  return exceptions.reduce((sum, e) => sum + (e.durationHours || 0), 0);
}

function getNext7DaysAvailability(
  availabilityData: AvailabilityData,
): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date();
  const recurring = availabilityData.recurringSchedule;
  const exceptions = availabilityData.exceptions || [];

  if (!recurring) return result;

  const { validity, dailyRecurrence } = recurring;
  if (!validity?.startDate || !validity?.endDate) return result;

  const workHours = getWorkHours(availabilityData);
  const start = startOfUTCDay(new Date(validity.startDate)).getTime();
  const end = startOfUTCDay(new Date(validity.endDate)).getTime();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateUTC = startOfUTCDay(date).getTime();
    const weekday = date.getUTCDay();

    const isWithinValidity = dateUTC >= start && dateUTC <= end;
    const isWorkingDay = dailyRecurrence.daysOfWeek.includes(weekday);

    const dayExceptions = exceptions.filter((ex) => {
      const exDate = startOfUTCDay(new Date(ex.startTime)).getTime();
      return exDate === dateUTC;
    });

    const exceptionHours = getExceptionHours(dayExceptions);

    let status: DayStatus = "unavailable";
    if (isWithinValidity && isWorkingDay) status = "available";
    if (dayExceptions.length > 0) status = "partial";
    if (!isWithinValidity || !isWorkingDay) status = "unavailable";

    result.push({
      date,
      status,
      exceptions: dayExceptions,
      exceptionHours,
      workHours,
    });
  }

  return result;
}

const WeeklyAvailabilityStrip: React.FC<Props> = ({ availabilityData }) => {
  const days = getNext7DaysAvailability(availabilityData);
  const validity = availabilityData.recurringSchedule?.validity;

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpanded((p) => ({ ...p, [idx]: !p[idx] }));
  };

  const statusStyles = {
    available: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <FaCheckCircle className="text-emerald-600" />,
    },
    unavailable: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <FaTimesCircle className="text-red-600" />,
    },
    partial: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <FaExclamationTriangle className="text-amber-600" />,
    },
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Weekly Availability
        </h4>
      </div>

      <div className="grid gap-3 grid-cols-4">
        {/* Validity Period Info Card */}
        <div className="rounded-2xl text-center overflow-hidden flex flex-col justify-between bg-gray-50 text-gray-700 border border-gray-100">
          <div className="pt-4 px-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Schedule
            </div>
            <div className="mt-2 flex flex-col gap-1 px-1">
              <div className="bg-white rounded-lg py-1 shadow-sm border border-gray-100">
                <p className="text-[9px] uppercase font-bold text-gray-400">
                  From
                </p>
                <p className="text-[10px] font-bold">
                  {formatLocalDate(validity?.startDate)}
                </p>
              </div>
              <div className="bg-white rounded-lg py-1 shadow-sm border border-gray-100">
                <p className="text-[9px] uppercase font-bold text-gray-400">
                  Till
                </p>
                <p className="text-[10px] font-bold">
                  {formatLocalDate(validity?.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Availability */}
        {days.map((d, idx) => {
          const dayLabel = d.date.toLocaleDateString("en-IN", {
            weekday: "short",
          });
          const date = d.date.getDate();
          const style = statusStyles[d.status];
          const isExpanded = expanded[idx];
          const visibleExceptions = isExpanded
            ? d.exceptions
            : d.exceptions.slice(0, 2);
          const hasMore = d.exceptions.length > 2;

          return (
            <div
              key={idx}
              className={`rounded-2xl text-center overflow-hidden flex flex-col justify-between ${style.bg} ${style.text}`}
            >
              <div className="pt-4 px-2">
                <div className="text-xs font-medium uppercase">{dayLabel}</div>
                <div className="text-xl font-bold mt-1">{date}</div>
                {d.status !== "partial" && (
                  <div className="mt-2 flex justify-center">{style.icon}</div>
                )}
              </div>

              {d.status === "partial" ? (
                <div
                  className="bg-red-500/90 text-white text-[10px] leading-tight px-1 py-1 flex flex-col items-center gap-0.5 overflow-hidden"
                  style={{ minHeight: "44px" }}
                >
                  {visibleExceptions.map((ex, i) => (
                    <div
                      key={i}
                      className="truncate w-full text-center"
                      title={`${formatTimeOnly(ex.startTime)}–${formatTimeOnly(ex.endTime)}`}
                    >
                      {formatTimeOnly(ex.startTime)}–
                      {formatTimeOnly(ex.endTime)}
                    </div>
                  ))}

                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      className="mt-0.5 text-[9px] font-medium underline opacity-90 hover:opacity-100"
                    >
                      {isExpanded ? "Less" : `+${d.exceptions.length - 2}`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-[44px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyAvailabilityStrip;
