import React from "react";
import { StatCard } from "./StatCard";
import type {
  DashboardOverviewProps,
  OverviewStat,
} from "./DashboardOverview.types";
import { DateFilterOption } from "../../hooks/useAdminDashboard";

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName,
  userStats,
  rideStats,
  driverStats,
  isLoading,
  filter,
  onFilterChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}) => {
  const filterLabels: Record<DateFilterOption, string> = {
    today: "today",
    "7days": "in last 7 days",
    "1month": "in last 1 month",
    "3months": "in last 3 months",
    "6months": "in last 6 months",
    "1year": "in last 1 year",
    all: "all time",
    custom: "in custom range",
  };

  const stats: OverviewStat[] = [
    {
      id: "total-users",
      title: "Total Users",
      value: isLoading
        ? "..."
        : (userStats?.totalUsers.toLocaleString() ?? "0"),
      change: userStats?.newUsers
        ? {
            value: userStats.newUsers,
            type: "increase",
            label: filterLabels[filter],
          }
        : undefined,
      color: "blue",
      icon: "users",
    },
    {
      id: "active-drivers",
      title: "Active Drivers",
      value: isLoading
        ? "..."
        : (driverStats?.driverStats.statusBreakdown.active ?? 0),
      color: "green",
      icon: "drivers",
    },
    {
      id: "total-rides",
      title: "Total Rides",
      value: isLoading
        ? "..."
        : (rideStats?.rideStats.totalRides.toLocaleString() ?? "0"),
      color: "yellow",
      icon: "rides",
    },
    {
      id: "revenue",
      title: "Revenue",
      value:
        isLoading || !rideStats
          ? "..."
          : new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: rideStats.rideStats.currency,
              maximumFractionDigits: 0,
            }).format(rideStats.rideStats.totalAmount),
      color: "purple",
      icon: "revenue",
    },
  ];

  const convertToInputDate = (
    dateVal: string | Date | null | undefined,
  ): string => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  return (
    <div>
      {/* Welcome Section Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening today.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 font-bold whitespace-nowrap">
              View for:
            </span>
            <select
              value={filter}
              onChange={(e) =>
                onFilterChange(e.target.value as DateFilterOption)
              }
              className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg font-semibold focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[140px]"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="1month">Last 1 Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Range 📅</option>
            </select>
          </div>

          {filter === "custom" && onFromDateChange && onToDateChange && (
            <div className="flex items-center gap-2 border-l pl-3 border-gray-200 animate-fadeIn">
              <div className="flex items-center space-x-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  From
                </label>
                <input
                  type="date"
                  value={convertToInputDate(fromDate)}
                  onChange={(e) =>
                    onFromDateChange(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  To
                </label>
                <input
                  type="date"
                  value={convertToInputDate(toDate)}
                  onChange={(e) =>
                    onToDateChange(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};
