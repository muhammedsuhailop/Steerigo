import React, { useState, useEffect } from "react";
import type { RequestTimerProps } from "./RequestTimer.types";

export const RequestTimer: React.FC<RequestTimerProps> = ({
  initialTime,
  onTimeUp,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const mmss = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(
    2,
    "0"
  )}`;
  const color =
    timeLeft > 20
      ? "text-emerald-600"
      : timeLeft > 10
      ? "text-yellow-600"
      : "text-red-600";
  const dotColor =
    timeLeft > 20
      ? "bg-emerald-500"
      : timeLeft > 10
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
      <span className={`text-sm font-medium ${color}`}>{mmss}</span>
    </div>
  );
};
