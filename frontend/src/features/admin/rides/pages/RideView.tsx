import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdDirectionsCar,
  MdPerson,
  MdMap,
  MdHistory,
  MdPayments,
  MdInfoOutline,
  MdLocalOffer,
  MdAccessTime,
} from "react-icons/md";
import { useGetAdminRideByIdQuery } from "../services/adminRideApi";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import { Button } from "@/shared/components/ui";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  StatusBadge,
  SectionHeader,
  DataItem,
} from "../components/RideDetailCards";
import { RideTimeline } from "../components/RideTimeline";
import { PaymentStatusCard } from "../components/PaymentStatusCard";

export const RideView: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const { data, isLoading } = useGetAdminRideByIdQuery(rideId || "");

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!data?.data)
    return <div className="p-10 text-center">Ride not found.</div>;

  const { ride, rider } = data.data;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "64px" : "256px" }}
      >
        <AdminTopbar
          title="Ride Details"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="p-4 lg:p-8 space-y-6">
          {/* Top Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all"
              >
                <MdArrowBack className="text-xl text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900">
                    {ride.rideId}
                  </h1>
                  <StatusBadge status={ride.status} />
                </div>
                <p className="text-sm text-gray-500">
                  Created on{" "}
                  {Formatters.formatDate(ride.createdAt, { includeTime: true })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <SectionHeader icon={<MdPerson />} title="Rider Info" />
                <div className="flex items-center gap-4">
                  <img
                    src={
                      rider.profilePicture ||
                      "https://ui-avatars.com/api/?name=" + rider.name
                    }
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md"
                    alt="profile"
                  />
                  <div>
                    <h4 className="font-black text-gray-900">{rider.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {rider.email}
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-1">
                      {rider.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <SectionHeader icon={<MdMap />} title="Trip Route" />

                  <div className="grid md:grid-cols-2 gap-8 relative">
                    <div className="hidden md:block absolute left-[15px] top-[45px] bottom-[45px] w-[2px] bg-dashed border-l-2 border-dashed border-gray-200"></div>

                    <div className="flex gap-4 relative z-10">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-100">
                        A
                      </div>
                      <DataItem
                        label="Pickup Point"
                        value={ride.pickup.address}
                        subValue={`Lat: ${ride.pickup.latitude}, Lng: ${ride.pickup.longitude}`}
                      />
                    </div>

                    <div className="flex gap-4 relative z-10">
                      <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-100">
                        B
                      </div>
                      <DataItem
                        label="Drop Point"
                        value={ride.drop.address}
                        subValue={`Lat: ${ride.drop.latitude}, Lng: ${ride.drop.longitude}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex gap-6 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <MdDirectionsCar /> {ride.rideType}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <SectionHeader
                  icon={<MdPayments />}
                  title="Payment Breakdown"
                />
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
                    label="Tax (GST)"
                    value={Formatters.formatCurrency(
                      ride.fare.tax.total.amount,
                      ride.fare.tax.total.currency,
                    )}
                  />
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <DataItem
                      label="Total Payable"
                      value={
                        <span className="text-blue-700 text-lg">
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
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <MdLocalOffer className="text-orange-500 text-xl" />
                      <div>
                        <p className="text-sm font-black text-orange-900">
                          Promo Applied: {ride.couponDetails.couponCode}
                        </p>
                        <p className="text-xs text-orange-700">
                          {ride.couponDetails.discountType} Discount
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      -
                      {Formatters.formatCurrency(
                        ride.couponDetails.discountAmount,
                        ride.fare.currency,
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <PaymentStatusCard
                status={ride.paymentStatus}
                amount={ride.fare.payableAmount}
                currency={ride.fare.currency}
              />

              <RideTimeline timeline={ride.timeline} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
