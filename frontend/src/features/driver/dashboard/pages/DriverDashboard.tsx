import React, { useState, useEffect } from "react";
import {
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

const DriverDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const isOnline = driver?.currentStatus === "Available";

  const getErrorDetails = (error: any) => {
    if (!error)
      return { status: undefined, code: undefined, message: undefined };

    const status = error.status || error.data?.status;
    const code = error.code || error.data?.code;
    const message = error.message || error.data?.message;

    return { status, code, message };
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
          <DriverStats stats={stats} />
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
