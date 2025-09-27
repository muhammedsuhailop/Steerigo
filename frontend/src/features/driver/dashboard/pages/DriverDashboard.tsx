import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useDriverDashboard } from "../hooks/useDriverDashboard";
import { useDriverOperations } from "../hooks/useDriverOperations";
import {
  DriverSidebar,
  DriverTopbar,
  DriverProfile,
  DriverStats,
  DriverActions,
  PendingRequests,
  CurrentRide,
} from "../components";
import { Footer } from "@/features/public/components";

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    driver,
    stats,
    pendingRequests,
    currentRide,
    isLoading,
    error,
    isOnline,
  } = useDriverDashboard();

  const {
    toggleOnlineStatus,
    acceptRideRequest,
    rejectRideRequest,
    updateRideStatus,
    refreshData,
  } = useDriverOperations();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const handleGoOnline = () => {
    toggleOnlineStatus(!isOnline);
  };

  const handleScheduleAvailability = () => {
    // TODO: Implement schedule booking
    console.log("Schedule booking clicked");
  };

  const handleViewEarnings = () => {
    // TODO: Navigate to earnings page
    console.log("View earnings clicked");
  };

  if (isLoading && !driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
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
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Topbar */}
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Dashboard" />

        {/* Page Content */}
        <main className="flex-1 px-6 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {driver.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Driver Profile */}
          <DriverProfile
            driver={driver}
            isOnline={isOnline}
            onToggleStatus={toggleOnlineStatus}
            loading={isLoading}
          />

          {/* Stats */}
          <DriverStats stats={stats} loading={isLoading} />

          {/* Actions */}
          <DriverActions
            isOnline={isOnline}
            onGoOnline={handleGoOnline}
            onScheduleAvailability={handleScheduleAvailability}
            onViewEarnings={handleViewEarnings}
            loading={isLoading}
          />

          {/* Pending Requests */}
          <PendingRequests
            requests={pendingRequests}
            onAccept={acceptRideRequest}
            onReject={rejectRideRequest}
            loading={isLoading}
          />

          {/* Current Ride */}
          {currentRide && (
            <CurrentRide
              ride={currentRide}
              onUpdateStatus={updateRideStatus}
              loading={isLoading}
            />
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
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
