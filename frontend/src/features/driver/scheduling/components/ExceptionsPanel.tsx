import React from "react";
import { FaExclamationTriangle, FaClock } from "react-icons/fa";
import { Exception } from "../types/scheduling.types";

interface Props {
  exceptions: Exception[];
}

function formatLocalDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const ExceptionsPanel: React.FC<Props> = ({ exceptions }) => {
  const activeExceptions = exceptions;

  if (activeExceptions.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3 text-amber-700">
        <FaExclamationTriangle />
        <h4 className="text-sm font-semibold">Active Exceptions</h4>
      </div>

      <div className="space-y-3">
        {activeExceptions.map((ex, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="font-medium capitalize">{ex.type}</p>
                <p className="text-xs text-amber-700 mt-1">{ex.reason}</p>
              </div>

              {ex.isRecurring && (
                <span className="text-xs bg-amber-100 px-2 py-0.5 rounded-full">
                  Recurring ({ex.recurringPattern})
                </span>
              )}
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs">
              <FaClock className="mt-0.5" />
              <div>
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {formatLocalDateTime(ex.startTime)}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {formatLocalDateTime(ex.endTime)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExceptionsPanel;
