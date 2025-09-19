import React from "react";
import { StatCard } from "./StatCard";
import type {
  DashboardOverviewProps,
  OverviewStat,
} from "./DashboardOverview.types";

const overviewStats: OverviewStat[] = [
  {
    id: "total-users",
    title: "Total Users",
    value: "1,234",
    change: { value: 12, type: "increase" },
    color: "blue",
    icon: "users",
  },
  {
    id: "active-drivers",
    title: "Active Drivers",
    value: 567,
    change: { value: 8, type: "increase" },
    color: "green",
    icon: "drivers",
  },
  {
    id: "total-rides",
    title: "Total Rides",
    value: "8,901",
    change: { value: 15, type: "increase" },
    color: "yellow",
    icon: "rides",
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "₹2,34,567",
    change: { value: 23, type: "increase" },
    color: "purple",
    icon: "revenue",
  },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName,
}) => {
  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600">Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};
