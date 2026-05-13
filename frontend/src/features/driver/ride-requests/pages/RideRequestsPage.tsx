import React, { useState, useEffect } from "react";
import { DriverSidebar, DriverTopbar } from "../../shared/components";
import { Footer } from "@/features/public/components";
import { Alert } from "@/shared/components/ui/Alert";
import { useRideRequests } from "../hooks/useRideRequests";
import { useDriverRealtime } from "../hooks/useDriverRealtime";
import { RideRequestsHeader } from "../components/RideRequestsHeader";
import { RideRequestsList } from "../components/RideRequestsList";
import {
  useAcceptFutureRideRequestMutation,
  useGetFutureRideRequestsQuery,
} from "../services/rideRequestsApi";
import { FutureRideRequestsList } from "../components/FutureRideRequestsList";
import { FutureRideRequestsHeader } from "../components/FutureRideRequestsHeader";

export const RideRequestsPage: React.FC = () => {
  useDriverRealtime();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    requests,
    total,
    isLoading,
    isFetching,
    acceptingRequestId,
    rejectingRequestId,
    error,
    success,
    acceptRequest,
    rejectRequest,
    refresh,
    clearError,
    clearSuccess,
  } = useRideRequests();

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
    if (success) {
      const timer = setTimeout(clearSuccess, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const {
    data: futureData,
    isLoading: isFutureLoading,
    isFetching: isFutureFetching,
    refetch: refetchFutureData,
  } = useGetFutureRideRequestsQuery({
    status: "Matched",
  });

  const [acceptFuture] = useAcceptFutureRideRequestMutation();
  const [acceptingFutureId, setAcceptingFutureId] = useState<string | null>(
    null,
  );

  const handleAcceptFuture = async (requestId: string) => {
    setAcceptingFutureId(requestId);
    try {
      await acceptFuture(requestId).unwrap();
    } catch (err) {
      console.log(error);
    } finally {
      setAcceptingFutureId(null);
    }
  };

  const refreshFuture = () => {
    refetchFutureData();
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const handleAccept = async (requestId: string) => {
    await acceptRequest(requestId);
  };

  const handleReject = async (requestId: string) => {
    await rejectRequest(requestId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Topbar */}
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Ride Requests" />

        {/* Alert Banner */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          {error && (
            <Alert type="danger" message={error} onClose={clearError} />
          )}
          {success && (
            <Alert type="success" message={success} onClose={clearSuccess} />
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-12 py-8 w-full grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
          {/* Instant Ride Requests  */}
          <section className="flex flex-col">
            <RideRequestsHeader
              total={total}
              onRefresh={refresh}
              isRefreshing={isFetching}
            />

            <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200/60 shadow-sm p-4 min-h-[400px]">
              <RideRequestsList
                requests={requests}
                isLoading={isLoading}
                onAccept={handleAccept}
                onReject={handleReject}
                acceptingRequestId={acceptingRequestId}
                rejectingRequestId={rejectingRequestId}
              />
            </div>
          </section>

          {/* Scheduled Requests */}
          <section className="flex flex-col">
            <FutureRideRequestsHeader
              total={futureData?.data.pagination.total || 0}
              onRefresh={refreshFuture}
              isRefreshing={isFutureFetching}
            />

            <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200/60 shadow-sm p-4 min-h-[400px]">
              <FutureRideRequestsList
                requests={futureData?.data.requests || []}
                isLoading={isFutureLoading}
                onAccept={handleAcceptFuture}
                acceptingRequestId={acceptingFutureId}
              />
            </div>
          </section>
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
