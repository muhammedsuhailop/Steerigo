import React from "react";
import { FaCar, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { Card } from "@/shared/components/ui/Card";
import { UserStats } from "../../types/userStats.types";

interface ProfileStatsProps {
  stats: UserStats;
  isLoading?: boolean;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  isLoading,
}) => {
  const { rideStats, ratingStats } = stats;

  const rideCards = [
    {
      label: "Total Rides",
      value: rideStats.totalRides,
      icon: <FaCar />,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: rideStats.completedRides,
      icon: <FaCheckCircle />,
      color: "text-green-600",
    },
    {
      label: "Cancelled",
      value: rideStats.cancelledRides,
      icon: <FaTimesCircle />,
      color: "text-red-600",
    },
    {
      label: "Total Spend",
      value: `${rideStats.totalSpend.toFixed(2)} ${rideStats.currency}`,
      icon: <MdOutlinePayments />,
      color: "text-purple-600",
    },
  ];

  if (isLoading) return <div>Loading Stats...</div>;

  return (
    <div className="space-y-6">
      {/* Ride Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {rideCards.map((card, i) => (
          <Card key={i} className="p-4 flex items-center space-x-4">
            <div className={`text-2xl ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Ratings Section */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <FaStar className="text-yellow-500 mr-2" /> Rating Overview
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-gray-900">
              {isLoading
                ? "..."
                : (Math.floor(ratingStats.averageRating * 10) / 10).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-xs text-gray-400 mt-1">
              {ratingStats.totalRatings} total ratings
            </p>
          </div>

          <div className="flex-1 w-full space-y-2">
            {Object.entries(ratingStats.distribution)
              .reverse()
              .map(([key, value]) => (
                <div key={key} className="flex items-center text-sm">
                  <span className="w-20 capitalize text-gray-600">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full mx-3 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${(value / ratingStats.totalRatings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-4">{value}</span>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
