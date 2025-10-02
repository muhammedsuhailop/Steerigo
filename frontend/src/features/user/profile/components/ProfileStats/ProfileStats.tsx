import React from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";
import { MdTrendingUp, MdAccessTime } from "react-icons/md";
import { Card } from "@/shared/components/ui/Card";
import type { ProfileStatsProps } from "./ProfileStats.types";

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  const statsCards = [
    {
      title: "Total Rides",
      value: stats.totalRides,
      color: "blue",
      icon: <FaCar className="w-6 h-6" />,
      description: "All time rides",
    },
    {
      title: "Completed Rides",
      value: stats.completedRides,
      color: "green",
      icon: <FaCalendarCheck className="w-6 h-6" />,
      description: "Successfully completed",
    },
    {
      title: "Cancelled Rides",
      value: stats.cancelledRides,
      color: "red",
      icon: <FaTimes className="w-6 h-6" />,
      description: "Cancelled by user",
    },
    {
      title: "Total Spent",
      value: `₹${stats.totalSpent.toLocaleString()}`,
      color: "purple",
      icon: <MdTrendingUp className="w-6 h-6" />,
      description: "All time spending",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: "text-blue-600",
        border: "border-blue-100",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: "text-green-600",
        border: "border-green-100",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: "text-red-600",
        border: "border-red-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        icon: "text-purple-600",
        border: "border-purple-100",
      },
    };
    return colors[color as keyof typeof colors];
  };

  const calculateRideSuccessRate = () => {
    if (stats.totalRides === 0) return 0;
    return ((stats.completedRides / stats.totalRides) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card
              key={index}
              className={`${colors.bg} ${colors.border} border`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${colors.text} mb-1`}>
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {isLoading ? "..." : stat.value}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`${colors.icon}`}>{stat.icon}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ride Performance */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ride Performance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {isLoading ? "..." : `${calculateRideSuccessRate()}%`}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: isLoading ? "0%" : `${calculateRideSuccessRate()}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-green-600">
                    {isLoading ? "..." : stats.completedRides}
                  </div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="font-semibold text-red-600">
                    {isLoading ? "..." : stats.cancelledRides}
                  </div>
                  <div className="text-gray-600">Cancelled</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Favorite Destinations */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Favorite Destinations
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : stats.favoriteDestinations.length > 0 ? (
              <div className="space-y-3">
                {stats.favoriteDestinations
                  .slice(0, 5)
                  .map((destination, index) => (
                    <div key={index} className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 truncate">
                        {destination}
                      </span>
                    </div>
                  ))}
                {stats.favoriteDestinations.length > 5 && (
                  <div className="text-xs text-gray-500 mt-2">
                    +{stats.favoriteDestinations.length - 5} more destinations
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaMapMarkerAlt className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No favorite destinations yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Take more rides to see your favorite places
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Member Since */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <MdAccessTime className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <h4 className="font-semibold text-gray-900">Member Since</h4>
              <p className="text-sm text-gray-600">
                {isLoading
                  ? "..."
                  : new Date(stats.memberSince).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
