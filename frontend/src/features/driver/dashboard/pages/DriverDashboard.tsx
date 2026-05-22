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

export type DateFilterOption =
  | "today"
  | "7days"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "all";

const getDateRangeForFilter = (
  filter: DateFilterOption,
): { fromDate?: string; toDate?: string } => {
  if (filter === "all") {
    return { fromDate: undefined, toDate: undefined };
  }

  const toDate = new Date();
  const fromDate = new Date();

  // Set times to cover the full day
  toDate.setHours(23, 59, 59, 999);
  fromDate.setHours(0, 0, 0, 0);

  switch (filter) {
    case "today":
      break;
    case "7days":
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case "1month":
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case "3months":
      fromDate.setMonth(fromDate.getMonth() - 3);
      break;
    case "6months":
      fromDate.setMonth(fromDate.getMonth() - 6);
      break;
    case "1year":
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;
  }

  return {
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  };
};

const DriverDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [filter, setFilter] = useState<DateFilterOption>("7days");

  const dateRangeParams = useMemo(
    () => getDateRangeForFilter(filter),
    [filter],
  );

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
      return {
        status: undefined,
        code: undefined,
        message: undefined,
      };
    }

    const err = error as {
      status?: number;
      code?: string;
      message?: string;
      data?: {
        status?: number;
        code?: string;
        message?: string;
      };
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

  if (isDriverNotFound) {
    return null;
  }

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
                "Failed to load dashboard data"}
            </p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  View for:
                </span>
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as DateFilterOption)
                  }
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[140px]"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="1month">Last 1 Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last 1 Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            {statsData && (
              <DriverStats stats={statsData} loading={isStatsLoading} />
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Mobile Sidebar Overlay */}
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
