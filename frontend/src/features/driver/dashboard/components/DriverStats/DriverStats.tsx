import React from "react";
import { FaCar, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import type { DriverStatsProps } from "./DriverStats.types";

export const DriverStats: React.FC<DriverStatsProps> = ({
  stats,
  loading = false,
  className = "",
}) => {
  const { rideStats, ratingStats } = stats;

  const truncatedRating = (
    Math.floor(ratingStats.averageRating * 10) / 10
  ).toFixed(1);

  const statItems = [
    {
      label: "Total Rides",
      value: rideStats.totalRides,
      icon: <FaCar />,
      iconColor: "text-blue-600",
      glow: "from-blue-500/20 to-blue-100/10",
      border: "border-blue-100",
    },
    {
      label: "Completed",
      value: rideStats.completedRides,
      icon: <FaCheckCircle />,
      iconColor: "text-emerald-600",
      glow: "from-emerald-500/20 to-emerald-100/10",
      border: "border-emerald-100",
    },
    {
      label: "Cancelled",
      value: rideStats.cancelledRides,
      icon: <FaTimesCircle />,
      iconColor: "text-red-600",
      glow: "from-red-500/20 to-red-100/10",
      border: "border-red-100",
    },
    {
      label: "Total Earnings",
      value: `₹${rideStats.totalEarnings.toLocaleString()}`,
      icon: <MdOutlinePayments />,
      iconColor: "text-amber-600",
      glow: "from-amber-500/20 to-amber-100/10",
      border: "border-amber-100",
    },
  ];

  const ratingDistribution = [
    {
      label: "5★",
      value: ratingStats.distribution.fourToFive,
      color: "from-emerald-400 to-emerald-500",
    },
    {
      label: "4★",
      value: ratingStats.distribution.threeToFour,
      color: "from-lime-400 to-lime-500",
    },
    {
      label: "3★",
      value: ratingStats.distribution.twoToThree,
      color: "from-yellow-400 to-yellow-500",
    },
    {
      label: "2★",
      value: ratingStats.distribution.oneToTwo,
      color: "from-orange-400 to-orange-500",
    },
    {
      label: "1★",
      value: ratingStats.distribution.zeroToOne,
      color: "from-red-400 to-red-500",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className={`
              group relative overflow-hidden
              rounded-3xl border ${item.border}
              bg-white/90 backdrop-blur-sm
              p-5 shadow-sm
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            `}
          >
            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {item.label}
                </p>

                <p className="text-3xl font-black tracking-tight text-gray-900">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    item.value
                  )}
                </p>
              </div>

              <div
                className={`
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl border border-white/70
                  bg-white shadow-md
                  transition-all duration-300
                  group-hover:scale-110 group-hover:rotate-3
                  ${item.iconColor}
                `}
              >
                <span className="text-[22px]">{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Section */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          {/* Left Rating Summary */}
          <div className="relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 px-10 py-8 lg:w-[260px]">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-amber-50" />

            <div className="relative text-center">
              <div className="flex items-center justify-center gap-2">
                <FaStar className="text-yellow-400 text-xl" />

                <p className="text-6xl font-black tracking-tight text-gray-900">
                  {loading ? "..." : truncatedRating}
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Average Rating
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Based on {ratingStats.totalRatings} ratings
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 p-6">
            <div className="space-y-3">
              {ratingDistribution.map((item) => {
                const percentage =
                  ratingStats.totalRatings > 0
                    ? (item.value / ratingStats.totalRatings) * 100
                    : 0;

                return (
                  <div
                    key={item.label}
                    className="
                      group flex items-center gap-3
                      rounded-xl px-2 py-1.5
                      transition-all duration-200
                      hover:bg-gray-50
                    "
                  >
                    <div className="w-10 shrink-0">
                      <span className="text-sm font-bold text-gray-700">
                        {item.label}
                      </span>
                    </div>

                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`
                          absolute left-0 top-0 h-full rounded-full
                          bg-gradient-to-r ${item.color}
                          transition-all duration-700 ease-out
                        `}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="flex min-w-[70px] items-center justify-end gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {item.value}
                      </span>

                      <span className="text-xs font-medium text-gray-500">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
