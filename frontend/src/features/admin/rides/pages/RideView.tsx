import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdDirectionsCar,
  MdPerson,
  MdMap,
  MdPayments,
  MdLocalOffer,
} from "react-icons/md";
import { useGetAdminRideByIdQuery } from "../services/adminRideApi";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  StatusBadge,
  SectionHeader,
  DataItem,
} from "../components/RideDetailCards";
import { RideTimeline } from "../components/RideTimeline";
import { PaymentStatusCard } from "../components/PaymentStatusCard";
import { RideRatingCard } from "../components/RideRatingCard";
import { AdminLayout } from "../../shared/components/AdminLayout/AdminLayout";

export const RideView: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAdminRideByIdQuery(rideId || "");

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="animate-pulse font-black text-gray-400">
          Loading Ride Intelligence...
        </div>
      </div>
    );

  if (!data?.data)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Ride data context not found.
      </div>
    );

  const { ride, rider } = data.data;

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
              <p className="text-sm font-medium text-gray-400">
                Logged on{" "}
                {Formatters.formatDate(ride.createdAt, { includeTime: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT SIDE: Operational Details */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[320px] flex flex-col">
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

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[280px] flex-1">
              <SectionHeader icon={<MdPayments />} title="Financial Audit" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <DataItem
                  label="Base Fare"
                  value={Formatters.formatCurrency(
                    ride.fare.baseFare,
                    ride.fare.currency,
                  )}
                />
                <DataItem
                  label="Platform Fee"
                  value={Formatters.formatCurrency(
                    ride.fare.platformFee,
                    ride.fare.currency,
                  )}
                />
                <DataItem
                  label="Tax Component"
                  value={Formatters.formatCurrency(
                    ride.fare.tax.total.amount,
                    ride.fare.tax.total.currency,
                  )}
                />
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-inner">
                  <DataItem
                    label="Final Payable"
                    value={
                      <span className="text-blue-700 text-xl font-black">
                        {Formatters.formatCurrency(
                          ride.fare.payableAmount,
                          ride.fare.currency,
                        )}
                      </span>
                    }
                  />
                </div>
              </div>
              {ride.couponDetails && (
                <div className="flex items-center justify-between p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MdLocalOffer className="text-orange-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-orange-900 uppercase">
                        Code: {ride.couponDetails.couponCode}
                      </p>
                      <p className="text-[10px] font-bold text-orange-700 uppercase">
                        {ride.couponDetails.discountType} Reduction applied
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-orange-600">
                    -{" "}
                    {Formatters.formatCurrency(
                      ride.couponDetails.discountAmount,
                      ride.fare.currency,
                    )}
                  </span>
                </div>
              )}
            </div>
            <RideRatingCard rating={ride.rating} />
          </div>

          {/* RIGHT SIDE: Participants & Timeline */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
              <SectionHeader icon={<MdPerson />} title="Participant" />
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={
                      rider.profilePicture ||
                      `https://ui-avatars.com/api/?name=${rider.name}&background=6366f1&color=fff&bold=true`
                    }
                    className="h-16 w-16 rounded-2xl object-cover border-4 border-white shadow-xl"
                    alt="rider-avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 text-lg truncate">
                    {rider.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium truncate mb-2">
                    {rider.email}
                  </p>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100">
                    {rider.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
            <PaymentStatusCard
              status={ride.paymentStatus}
              amount={ride.fare.payableAmount}
              currency={ride.fare.currency}
            />
            <RideTimeline timeline={ride.timeline} />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default RideView;
