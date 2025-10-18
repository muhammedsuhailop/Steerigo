import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import {
  useGetDriverProfileQuery,
  useGetDriverStatsQuery,
  useGetPendingRequestsQuery,
  useGetCurrentRideQuery,
  useSetDriverOnlineStatusMutation,
  useAcceptRideRequestMutation,
  useRejectRideRequestMutation,
  useUpdateRideStatusMutation,
} from "../../shared/services/driverApi";
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
    data: driverData,
    isLoading: isDriverLoading,
    error: driverError,
    refetch: refetchDriver,
  } = useGetDriverProfileQuery();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetDriverStatsQuery();

  const {
    data: requestsData,
    isLoading: isRequestsLoading,
    refetch: refetchRequests,
  } = useGetPendingRequestsQuery();

  const {
    data: currentRideData,
    isLoading: isRideLoading,
    refetch: refetchCurrentRide,
  } = useGetCurrentRideQuery();

  const [setOnlineStatus, { isLoading: isTogglingStatus }] =
    useSetDriverOnlineStatusMutation();

  const [acceptRide, { isLoading: isAccepting }] =
    useAcceptRideRequestMutation();

  const [rejectRide, { isLoading: isRejecting }] =
    useRejectRideRequestMutation();

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateRideStatusMutation();

  // Extract data from responses
  const driver = driverData?.data;
  const stats = statsData?.data;
  const pendingRequests = requestsData?.data || [];
  const currentRide = currentRideData?.data;

  // Compute loading states
  const isLoading =
    isDriverLoading ||
    isStatsLoading ||
    isRequestsLoading ||
    isRideLoading ||
    isTogglingStatus ||
    isAccepting ||
    isRejecting ||
    isUpdatingStatus;

  const isOnline = driver?.currentStatus === "Available";

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

  const handleToggleOnlineStatus = async () => {
    try {
      await setOnlineStatus(!isOnline).unwrap();
    } catch (error) {
      console.error("Failed to toggle online status:", error);
      // TODO: Show error toast/notification
    }
  };

  const handleAcceptRideRequest = async (requestId: string) => {
    try {
      await acceptRide(requestId).unwrap();
    } catch (error) {
      console.error("Failed to accept ride:", error);
    }
  };

  const handleRejectRideRequest = async (requestId: string) => {
    try {
      await rejectRide(requestId).unwrap();
    } catch (error) {
      console.error("Failed to reject ride:", error);
    }
  };

  const handleUpdateRideStatus = async (
    rideId: string,
    status:
      | "accepted"
      | "pickup"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "rejected"
  ) => {
    try {
      await updateStatus({ rideId, status }).unwrap();
    } catch (error) {
      console.error("Failed to update ride status:", error);
    }
  };

  const handleScheduleAvailability = () => {
    console.log("Schedule booking clicked");
  };

  const handleViewEarnings = () => {
    console.log("View earnings clicked");
  };

  const refreshData = () => {
    refetchDriver();
    refetchStats();
    refetchRequests();
    refetchCurrentRide();
  };

  if (isDriverLoading && !driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (driverError) {
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
            <p className="text-gray-600 mb-4">
              {(driverError as any)?.data?.message ||
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
    return null;
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
          <DriverProfile
            driver={driver}
            isOnline={isOnline}
            onToggleStatus={handleToggleOnlineStatus}
            loading={isTogglingStatus}
          />
          <DriverStats stats={stats} loading={isStatsLoading} />
          <DriverActions
            isOnline={isOnline}
            onGoOnline={handleToggleOnlineStatus}
            onScheduleAvailability={handleScheduleAvailability}
            onViewEarnings={handleViewEarnings}
            loading={isTogglingStatus}
          />
          <PendingRequests
            requests={pendingRequests}
            onAccept={handleAcceptRideRequest}
            onReject={handleRejectRideRequest}
            loading={isAccepting || isRejecting}
          />
          {currentRide && (
            <CurrentRide
              ride={currentRide}
              onUpdateStatus={handleUpdateRideStatus}
              loading={isUpdatingStatus}
            />
          )}
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
