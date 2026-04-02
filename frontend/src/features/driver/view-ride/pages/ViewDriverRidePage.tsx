import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DriverSidebar, DriverTopbar } from "../../shared/components";
import { Footer } from "@/features/public/components";
import { Alert } from "@/shared/components/ui/Alert";
import { useGetDriverRideDetailsQuery } from "../services/viewDriverRideApi";
import {
  setDriverRideData,
  selectActiveDriverRide,
  selectActiveRider,
} from "../store/viewDriverRideSlice";
import { useViewDriverRide } from "../hooks/useViewDriverRide";
import FareBreakdown from "../../../user/view-ride/components/FareBreakdown";
import { RideTimelineStatus } from "../../../user/view-ride/components/RideTimelineStatus";
import RideRiderCard from "../components/RideRiderCard";
import RideActionControls from "../components/RideActionControls";
import { useDriverLocationUpdate } from "../hooks/useDriverLocationUpdate";
import LiveNavigationMap from "@/shared/components/maps/LiveNavigationMap";
import { RideStatus } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import RideStatsCard from "../components/RideStatsCard";

const ViewDriverRidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  useViewDriverRide(id);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    bearing: number;
  } | null>(null);

  const { data, isLoading, isFetching, error } = useGetDriverRideDetailsQuery(
    id as string,
    { skip: !id },
  );
  const activeRide = useSelector(selectActiveDriverRide);
  const activeRider = useSelector(selectActiveRider);

  const isInactive = useMemo(() => {
    if (!activeRide) return false;

    const isTerminated =
      activeRide.status === RideStatus.CANCELLED ||
      activeRide.status === RideStatus.REJECTED;

    const isFinishedAndPaid =
      activeRide.status === RideStatus.COMPLETED &&
      activeRide.paymentStatus !== PaymentStatus.PENDING &&
      activeRide.paymentStatus !== PaymentStatus.FAILED;

    return isTerminated || isFinishedAndPaid;
  }, [activeRide?.status, activeRide?.paymentStatus]);

  useEffect(() => {
    if (data?.success) {
      dispatch(
        setDriverRideData({ ride: data.data.ride, rider: data.data.rider }),
      );
    }
  }, [data, dispatch]);

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
    if (isInactive || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) =>
        setDriverLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          bearing: pos.coords.heading ?? 0,
        }),
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isInactive]);

  useDriverLocationUpdate(id, activeRide?.status, isInactive);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  if (isLoading || isFetching || !activeRide) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <DriverTopbar
          onToggleSidebar={toggleSidebar}
          title={isInactive ? "Ride Summary" : "Active Trip"}
        />

        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full space-y-6">
          {error && (
            <Alert type="danger" message="Failed to load ride details." />
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isInactive ? "Trip Summary" : "Active Trip"}
              </h1>
              <p className="text-sm text-gray-500">{activeRide.rideId}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest 
              ${isInactive ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"}`}
            >
              {activeRide.status}
            </span>
          </div>

          <div
            className={`grid grid-cols-1 ${isInactive ? "max-w-3xl mx-auto" : "lg:grid-cols-12"} gap-8`}
          >
            {/* Conditional Map View */}
            {!isInactive && (
              <div className="lg:col-span-7 space-y-6">
                <div className="h-[400px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
                  <LiveNavigationMap
                    pickupLocation={activeRide.pickup}
                    dropLocation={activeRide.drop}
                    driverLocation={driverLocation}
                    status={activeRide.status}
                  />
                </div>
                <RideTimelineStatus timeline={activeRide.timeline} />
              </div>
            )}

            <div
              className={`${isInactive ? "w-full" : "lg:col-span-5"} space-y-6`}
            >
              {/* Rider Info */}
              {activeRider && (
                <RideRiderCard rider={activeRider} minimal={isInactive} />
              )}

              {/* Action Controls or Status Banner */}
              {!isInactive ? (
                <RideActionControls
                  rideId={activeRide.rideId}
                  status={activeRide.status}
                  amount={activeRide.fare.payableAmount}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                  {activeRide.status === RideStatus.COMPLETED ? (
                    <FaCheckCircle className="text-green-500 text-3xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-3xl" />
                  )}
                  <div>
                    <p className="font-bold text-gray-900">
                      Ride {activeRide.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      This trip has ended and no further actions are required.
                    </p>
                  </div>
                </div>
              )}

              <RideStatsCard
                timeline={activeRide.timeline}
                rideType={activeRide.rideType}
                pickup={activeRide.pickup}
                drop={activeRide.drop}
              />

              <FareBreakdown fare={activeRide.fare} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ViewDriverRidePage;
