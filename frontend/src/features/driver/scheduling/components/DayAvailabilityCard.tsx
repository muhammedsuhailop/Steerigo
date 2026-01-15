import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  date: Date;
  isAvailable: boolean;
}

const DayAvailabilityCard: React.FC<Props> = ({ date, isAvailable }) => {
  const day = date.toLocaleDateString("en-IN", { weekday: "short" });
  const dayNum = date.getDate();

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-xl px-4 py-3 min-w-[72px]
        transition-all duration-200
        ${
          isAvailable
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }
        hover:scale-105
      `}
    >
      <span className="text-xs font-medium">{day}</span>
      <span className="text-lg font-bold">{dayNum}</span>
      <span className="mt-1">
        {isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
      </span>
    </div>
  );
};

export default DayAvailabilityCard;
