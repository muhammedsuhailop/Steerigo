import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRoute, FaClock, FaMapMarkerAlt } from "react-icons/fa";
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
import TripLocationMap from "@/shared/components/maps/TripLocationMap";
import FareBreakdown from "../../../user/view-ride/components/FareBreakdown";
import { RideTimelineStatus } from "../../../user/view-ride/components/RideTimelineStatus";
import RideRiderCard from "../components/RideRiderCard";
import RideActionControls from "../components/RideActionControls";
import { useDriverLocationUpdate } from "../hooks/useDriverLocationUpdate";

const ViewDriverRidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useViewDriverRide(id);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading, isFetching, error } = useGetDriverRideDetailsQuery(
    id as string,
    { skip: !id },
  );

  const activeRide = useSelector(selectActiveDriverRide);
  const activeRider = useSelector(selectActiveRider);

  useEffect(() => {
    if (data?.success) {
      dispatch(
        setDriverRideData({
          ride: data.data.ride,
          rider: data.data.rider,
        }),
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

  useDriverLocationUpdate(id, activeRide?.status);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

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
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Ride Details" />

        {/* Alerts */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          {error && (
            <Alert type="danger" message="Failed to load ride details." />
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full space-y-6">
          {isLoading || isFetching || !activeRide ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">
                    Active Trip
                  </h1>
                  <p className="text-sm text-gray-500">
                    Ride ID: {activeRide.rideId}
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    activeRide.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {activeRide.status}
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="h-[350px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
                    <TripLocationMap
                      pickupLocation={activeRide.pickup}
                      dropLocation={activeRide.drop}
                      tripType={activeRide.rideType as "oneway" | "roundtrip"}
                    />
                  </div>

                  <RideTimelineStatus timeline={activeRide.timeline} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 space-y-6">
                  {activeRider && <RideRiderCard rider={activeRider} />}

                  <RideActionControls
                    rideId={activeRide.id}
                    status={activeRide.status}
                  />

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                          <FaRoute />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Distance
                          </p>
                          <p className="text-sm font-bold">
                            {activeRide.distance.toFixed(2)} km
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Type
                          </p>
                          <p className="text-sm font-bold capitalize">
                            {activeRide.rideType}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <div className="w-0.5 h-10 bg-gray-100" />
                        <FaMapMarkerAlt className="text-red-500" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Pickup
                          </p>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {activeRide.pickup.address}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Dropoff
                          </p>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {activeRide.drop.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <FareBreakdown fare={activeRide.fare} />
                </div>
              </div>
            </>
          )}
        </main>

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

export default ViewDriverRidePage;
