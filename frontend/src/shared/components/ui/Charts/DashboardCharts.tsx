import React from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  SharedRideStatsSummary,
  TimelineChartItem,
} from "./DashboardChart.types";

interface DashboardChartsProps {
  timelineData?: TimelineChartItem[];
  statsSummary?: SharedRideStatsSummary;
  isLoading: boolean;
  role?: "admin" | "driver" | "general";
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  timelineData,
  statsSummary,
  isLoading,
  role = "general",
}) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 font-medium text-sm">
            Loading dashboard analytics...
          </span>
        </div>
      </div>
    );
  }

  const dynamicFinancialLabel = role === "driver" ? "Earnings" : "Revenue";

  const hasTimelineData = timelineData && timelineData.length > 0;
  const totalRidesRecorded =
    (statsSummary?.completedRides ?? 0) + (statsSummary?.cancelledRides ?? 0);
  const hasPieData = totalRidesRecorded > 0;

  const pieData = [
    {
      name: "Completed",
      value: statsSummary?.completedRides ?? 0,
      color: "#10B981",
    },
    {
      name: "Cancelled",
      value: statsSummary?.cancelledRides ?? 0,
      color: "#EF4444",
    },
  ];

  const formatChartDate = (
    dateString: string,
    options: Intl.DateTimeFormatOptions,
  ): string => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? dateString
      : parsedDate.toLocaleDateString("en-US", options);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Main Time-Series Chart Card Container */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {dynamicFinancialLabel} & Ride Volume Overview
          </h3>
          <p className="text-sm text-gray-500">
            Daily performance metrics and ride traffic
          </p>
        </div>

        <div className="h-72 w-full flex items-center justify-center">
          {hasTimelineData ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={timelineData}
                margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) =>
                    formatChartDate(tick, { month: "short", day: "numeric" })
                  }
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#3B82F6"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F59E0B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} r`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(label) =>
                    formatChartDate(label, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  yAxisId="right"
                  dataKey="totalRides"
                  name="Total Rides"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  opacity={0.8}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name={`${dynamicFinancialLabel} (₹)`}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2 animate-fadeIn">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                <BarChart3 size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">
                No activity recorded
              </h4>
              <p className="text-xs text-gray-400 max-w-xs">
                There are no fares or ride logs synced within this specific
                filter duration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ride Status Donut Chart Card Container */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Ride Status</h3>
          <p className="text-sm text-gray-500">Completion vs Cancellation</p>
        </div>

        <div className="h-72 w-full flex items-center justify-center">
          {hasPieData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: ValueType | undefined) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value || 0);
                    return [`${numericValue} Rides`, ""];
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2 animate-fadeIn">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                <PieIcon size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">
                No statuses found
              </h4>
              <p className="text-xs text-gray-400 max-w-xs">
                No bookings have reached a terminal status (completed or
                cancelled) yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
