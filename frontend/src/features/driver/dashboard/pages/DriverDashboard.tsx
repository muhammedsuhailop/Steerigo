import React, { useState, useEffect, useMemo } from "react";
import {
  useGetActualDriverStatsQuery,
  useGetDriverProfileQuery,
  useGetDriverStatsQuery,
} from "../../shared/services/driverApi";
import {
  DriverSidebar,
  DriverTopbar,
  DriverProfile,
  DriverStats,
} from "../components";
import { Footer } from "@/features/public/components";
import { useDispatch } from "react-redux";
import { setDriverId } from "../../shared/store/driverSlice";
import type {
  Driver,
  DriverStats as DriverStatsType,
} from "../../shared/types/driver.types";
import { useNavigate } from "react-router-dom";
import LiveLocationUpdater from "@/shared/components/ui/LiveLocationUpdater/LiveLocationUpdater";
import AutoLiveLocationUpdater from "@/shared/components/ui/LiveLocationUpdater/AutoLiveLocationUpdater";
import { DashboardCharts } from "@/shared/components/ui/Charts/DashboardCharts";

export type DateFilterOption =
  | "today"
  | "7days"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "all"
  | "custom";

const DriverDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [filter, setFilter] = useState<DateFilterOption>("7days");

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    if (filter === "custom") {
      const current = new Date();
      const past = new Date();
      past.setDate(current.getDate() - 7);
      setFromDate(past);
      setToDate(current);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  }, [filter]);

  const dateRangeParams = useMemo(() => {
    if (filter === "all") {
      return { fromDate: undefined, toDate: undefined };
    }

    if (filter === "custom") {
      return {
        fromDate: fromDate?.toISOString(),
        toDate: toDate?.toISOString(),
      };
    }

    const end = new Date();
    const start = new Date();

    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        break;
      case "7days":
        start.setDate(start.getDate() - 7);
        break;
      case "1month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "3months":
        start.setMonth(start.getMonth() - 3);
        break;
      case "6months":
        start.setMonth(start.getMonth() - 6);
        break;
      case "1year":
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return {
      fromDate: start.toISOString(),
      toDate: end.toISOString(),
    };
  }, [filter, fromDate, toDate]);

  const { data: statsData, isLoading: isStatsLoading } =
    useGetActualDriverStatsQuery(dateRangeParams);

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDriverStatsQuery();

  const {
    data: profileData,
    error: driverError,
    refetch: refetchDriver,
  } = useGetDriverProfileQuery();

  const dashboard = dashboardData?.data;
  const driver: Driver | undefined = dashboard?.driver;
  const stats: DriverStatsType | undefined = dashboard?.stats;

  const getErrorDetails = (error: unknown) => {
    if (!error || typeof error !== "object") {
      return { status: undefined, code: undefined, message: undefined };
    }
    const err = error as {
      status?: number;
      code?: string;
      message?: string;
      data?: { status?: number; code?: string; message?: string };
    };
    return {
      status: err.status ?? err.data?.status,
      code: err.code ?? err.data?.code,
      message: err.message ?? err.data?.message,
    };
  };

  const dashboardErr = getErrorDetails(dashboardError);
  const profileErr = getErrorDetails(driverError);

  const isDriverNotFound =
    dashboardErr.status === 404 ||
    profileErr.status === 404 ||
    dashboardErr.code === "NOT_FOUND" ||
    profileErr.code === "NOT_FOUND" ||
    dashboardErr.message?.toLowerCase().includes("driver not found") ||
    profileErr.message?.toLowerCase().includes("driver not found");

  useEffect(() => {
    if (isDriverNotFound) {
      navigate("/driver/register", { replace: true });
    }
  }, [isDriverNotFound, navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (driver?.driverId) {
      dispatch(setDriverId(driver.driverId));
    }
  }, [driver?.driverId, dispatch]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const refreshData = () => {
    refetchDashboard();
    refetchDriver();
  };

  if (isDriverNotFound) return null;

  if (isDashboardLoading && !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError || driverError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              {dashboardErr.message ||
                profileErr.message ||
                "Failed to load data"}
            </p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!driver || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-gray-600">No driver data available</p>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatToInputString = (d: Date | null): string => {
    if (!d) return "";
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Dashboard" />
        <main className="flex-1 px-6 py-8 space-y-8">
          <DriverProfile
            driver={{
              ...driver,
              profileImageUrl:
                profileData?.profileImageUrl ?? driver.profileImageUrl,
            }}
          />

          {driver.driverId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveLocationUpdater driverId={driver.driverId} />
              <AutoLiveLocationUpdater />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Overview
              </h2>

              <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    View for:
                  </span>
                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(e.target.value as DateFilterOption)
                    }
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[140px] font-semibold"
                  >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="1month">Last 1 Month</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last 1 Year</option>
                    <option value="all">All Time</option>
                    <option value="custom">Custom Range </option>
                  </select>
                </div>

                {filter === "custom" && (
                  <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-3 border-gray-200">
                    <div className="flex items-center space-x-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        From
                      </label>
                      <input
                        type="date"
                        value={formatToInputString(fromDate)}
                        onChange={(e) =>
                          setFromDate(
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        To
                      </label>
                      <input
                        type="date"
                        value={formatToInputString(toDate)}
                        onChange={(e) =>
                          setToDate(
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {statsData && (
              <div className="space-y-6">
                <DriverStats stats={statsData} loading={isStatsLoading} />

                <DashboardCharts
                  role="driver"
                  isLoading={isStatsLoading}
                  timelineData={statsData?.graphData?.earningsOverTime?.map(
                    (item) => ({
                      date: item.date,
                      totalRides: item.totalRides,
                      completedRides: item.completedRides,
                      cancelledRides: item.cancelledRides,
                      revenue: item.earnings,
                    }),
                  )}
                  statsSummary={{
                    totalRides: statsData?.rideStats?.totalRides ?? 0,
                    completedRides: statsData?.rideStats?.completedRides ?? 0,
                    cancelledRides: statsData?.rideStats?.cancelledRides ?? 0,
                    totalAmount: statsData?.rideStats?.totalEarnings ?? 0,
                    currency: statsData?.rideStats?.currency ?? "INR",
                  }}
                />
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
