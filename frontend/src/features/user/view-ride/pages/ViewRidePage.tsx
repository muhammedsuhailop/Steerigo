import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RideStatus } from "@/shared/types/ride.types";
import CompletedRideSummary from "../components/CompletedRideSummary";
import CancelRideButton from "../components/CancelRideButton";
import CouponSection from "../components/CouponSection";

const ViewRidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, isFetching, error } = useGetRideDetailsQuery(
    id as string,
    { skip: !id },
  );

  const activeRide = useSelector(selectActiveRide);
  const activeDriver = useSelector(selectActiveDriver);
  const { driverLocation } = useViewRide(id);

  useEffect(() => {
    if (data?.success) {
      dispatch(setRideData({ ride: data.data.ride, driver: data.data.driver }));
    }
  }, [data, dispatch]);

  const { isOngoing, isEndState } = useMemo(() => {
    if (!activeRide) return { isOngoing: false, isEndState: false };

    const endStatuses = [
      RideStatus.COMPLETED,
      RideStatus.CANCELLED,
      RideStatus.REJECTED,
    ];
    const status = activeRide.status as RideStatus;

    return {
      isOngoing: [
        RideStatus.REQUESTED,
        RideStatus.ACCEPTED,
        RideStatus.ARRIVED,
        RideStatus.STARTED,
      ].includes(status),
      isEndState: endStatuses.includes(status),
    };
  }, [activeRide?.status]);

  if (isLoading || isFetching || !activeRide) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Loading Trip Details
          </p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-20 text-center font-bold text-red-500 underline">
        Error loading ride details.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {isOngoing && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Live Journey
                </h1>
                <p className="text-gray-500 font-medium">
                  Tracking your ride in real-time
                </p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                {activeRide.status}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="h-[500px] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
                  <LiveTrackingMap
                    pickupLocation={activeRide.pickup}
                    dropLocation={activeRide.drop}
                    driverLocation={driverLocation}
                  />
                </div>
                <RideTimelineStatus timeline={activeRide.timeline} />
              </div>

              <div className="lg:col-span-4 space-y-6">
                {activeDriver ? (
                  <RideDriverCard driver={activeDriver} />
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-amber-900 font-bold animate-pulse text-center">
                    Finding your driver...
                  </div>
                )}
                <FareBreakdown
                  fare={activeRide.fare}
                  paymentStatus={activeRide.paymentStatus}
                />

                <CouponSection
                  rideId={id as string}
                  status={activeRide.status as RideStatus}
                  paymentStatus={activeRide.paymentStatus}
                  couponDetails={activeRide.couponDetails}
                />

                <CancelRideButton
                  rideId={id as string}
                  status={activeRide.status as RideStatus}
                />
              </div>
            </div>
          </div>
        )}

        {isEndState && (
          <CompletedRideSummary
            activeRide={activeRide}
            driver={activeDriver}
            user={{ name: user?.name || "", email: user?.email || "" }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ViewRidePage;
