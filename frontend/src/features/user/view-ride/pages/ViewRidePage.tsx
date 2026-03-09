import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaRoute, FaClock } from "react-icons/fa";
import { useGetRideDetailsQuery } from "../services/viewRideApi";
import {
  setRideData,
  selectActiveRide,
  selectActiveDriver,
} from "../store/viewRideSlice";
import { useViewRide } from "../hooks/useViewRide";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import RideDriverCard from "../components/RideDriverCard";
import FareBreakdown from "../components/FareBreakdown";
import { RideTimelineStatus } from "../components/RideTimelineStatus";
import LiveTrackingMap from "@/shared/components/maps/LiveTrackingMap";

const ViewRidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isFetching, error } = useGetRideDetailsQuery(
    id as string,
    {
      skip: !id,
    },
  );
  const activeRide = useSelector(selectActiveRide);
  const activeDriver = useSelector(selectActiveDriver);

  const { driverLocation } = useViewRide(id);

  useEffect(() => {
    if (data?.success) {
      dispatch(setRideData({ ride: data.data.ride, driver: data.data.driver }));
    }
  }, [data, dispatch]);

  console.log({
    id,
    isLoading,
    isFetching,
    data,
    activeRide,
  });
  if (isLoading || isFetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center">Failed to load ride details.</div>;
  }

  if (!activeRide) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trip Overview
          </h1>
          <p className="text-gray-600">
            Review your journey details, track your ride.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Ride ID + Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Ride ID
                </p>
                <p className="text-sm font-mono font-bold text-gray-900">
                  {activeRide.rideId}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  activeRide.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {activeRide.status}
              </span>
            </div>
            <RideTimelineStatus timeline={activeRide.timeline} />

            <div className="h-[400px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              <LiveTrackingMap
                pickupLocation={activeRide.pickup}
                dropLocation={activeRide.drop}
                driverLocation={driverLocation}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Driver Card */}
            {activeDriver ? (
              <RideDriverCard driver={activeDriver} />
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-amber-800 text-sm font-medium">
                Searching for your driver...
              </div>
            )}

            {/* Ride Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Metrics */}
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
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Trip Type
                    </p>
                    <p className="text-sm font-bold capitalize">
                      {activeRide.rideType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="flex gap-4 pt-2">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <div className="w-0.5 h-10 bg-gray-100" />
                  <FaMapMarkerAlt className="text-red-500" />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Pickup Location
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                      {activeRide.pickup.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Dropoff Location
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                      {activeRide.drop.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare */}
            <FareBreakdown fare={activeRide.fare} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ViewRidePage;
