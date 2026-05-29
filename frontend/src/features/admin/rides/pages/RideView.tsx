import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdDirectionsCar, MdMap } from "react-icons/md";
import { useGetAdminRideByIdQuery } from "../services/adminRideApi";
import {
  StatusBadge,
  SectionHeader,
  DataItem,
} from "../components/RideDetailCards";
import { RideTimeline } from "../components/RideTimeline";
import { PaymentStatusCard } from "../components/PaymentStatusCard";
import { RideRatingCard } from "../components/RideRatingCard";
import { AdminLayout } from "../../shared/components/AdminLayout/AdminLayout";
import { ParticipantsCard } from "../components/ParticipantsCard";
import { FareDetailsCard } from "../components/FareDetailsCard";

export const RideView: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAdminRideByIdQuery(rideId || "");

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="animate-pulse font-black text-gray-400">
          Loading Ride Details...
        </div>
      </div>
    );

  if (!data?.data)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Ride data context not found.
      </div>
    );

  const { ride, rider, driver } = data.data;

  return (
    <AdminLayout title="Ride Details">
      <main className="mx-auto w-full max-w-[1440px] p-4 lg:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all shadow-sm"
            >
              <MdArrowBack className="text-xl text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {ride.rideId}
                </h1>
                <StatusBadge status={ride.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            {/* Ride Path */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <SectionHeader icon={<MdMap />} title="Ride Path" />
                <div className="space-y-10 relative mt-4">
                  <div className="absolute left-[15px] top-[30px] bottom-[30px] w-[2px] border-l-2 border-dashed border-gray-200"></div>
                  <div className="flex gap-4 relative z-10">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 font-black shadow-lg shadow-green-100">
                      A
                    </div>
                    <DataItem
                      label="Pickup Location"
                      value={ride.pickup.address}
                      subValue={`Lat: ${ride.pickup.latitude.toFixed(4)}, Lng: ${ride.pickup.longitude.toFixed(4)}`}
                    />
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 font-black shadow-lg shadow-red-100">
                      B
                    </div>
                    <DataItem
                      label="Destination"
                      value={ride.drop.address}
                      subValue={`Lat: ${ride.drop.latitude.toFixed(4)}, Lng: ${ride.drop.longitude.toFixed(4)}`}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <MdDirectionsCar className="text-blue-500" /> {ride.rideType}
                </div>
              </div>
            </div>

            {/* Participants Component */}
            <ParticipantsCard rider={rider} driver={driver} />

            {/* Rating Component */}
            <RideRatingCard rating={ride.rating} />
          </div>

          {/* RIGHT SIDE*/}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            {/* Fare Details Component  */}
            <FareDetailsCard
              fare={ride.fare}
              couponDetails={ride.couponDetails}
            />

            {/* Payment Status */}
            <PaymentStatusCard
              status={ride.paymentStatus}
              amount={ride.fare.payableAmount}
              currency={ride.fare.currency}
            />

            {/* Timeline */}
            <RideTimeline timeline={ride.timeline} />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default RideView;
