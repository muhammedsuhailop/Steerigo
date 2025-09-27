import React from "react";
import type { DriverStatsProps, StatCard } from "./DriverStats.types";

export const DriverStats: React.FC<DriverStatsProps> = ({
  stats,
  loading = false,
  className = "",
}) => {
  const getStatCards = (): StatCard[] => [
    {
      title: "Scheduled Rides",
      value: stats.scheduledRides,
      color: "blue",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Rides Completed",
      value: stats.completedRides,
      color: "emerald",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Earned",
      value: `₹${stats.todayEarnings.toLocaleString()}`,
      subtitle: "Today",
      color: "yellow",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
  ];

  const statCards = getStatCards();

  const getCardColors = (color: StatCard["color"]) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: "text-blue-600",
        border: "border-blue-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: "text-emerald-600",
        border: "border-emerald-100",
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        icon: "text-yellow-600",
        border: "border-yellow-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        icon: "text-purple-600",
        border: "border-purple-100",
      },
    };
    return colors[color];
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {statCards.map((card, index) => {
        const colors = getCardColors(card.color);

        return (
          <div
            key={index}
            className={`${colors.bg} ${colors.border} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${colors.text} mb-1`}>
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${colors.text}`}>
                  {loading ? "..." : card.value}
                </p>
                {card.subtitle && (
                  <p className={`text-xs ${colors.text} opacity-75 mt-1`}>
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`${colors.icon} opacity-80`}>{card.icon}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
