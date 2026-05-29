import React, { useState } from "react";
import { MdPerson, MdStar } from "react-icons/md";
import { SectionHeader } from "./RideDetailCards";
import { DriverDetails, RiderDetails } from "../types/ride-details.types";

interface ParticipantsCardProps {
  rider: RiderDetails;
  driver: DriverDetails;
}

export const ParticipantsCard: React.FC<ParticipantsCardProps> = ({
  rider,
  driver,
}) => {
  const [riderImgBroken, setRiderImgBroken] = useState(false);
  const [driverImgBroken, setDriverImgBroken] = useState(false);

  const riderInitial = rider.name?.trim().charAt(0).toUpperCase() || "?";
  const driverInitial = driver.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1">
      <SectionHeader icon={<MdPerson />} title="Ride Participants" />

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="relative">
            {rider.profilePicture && !riderImgBroken ? (
              <img
                src={rider.profilePicture}
                onError={() => setRiderImgBroken(true)}
                className="h-14 w-14 rounded-2xl object-cover border-4 border-white shadow-md"
                alt="rider-avatar"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl border-4 border-white shadow-md bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                {riderInitial}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-0.5">
              Rider
            </p>
            <h4 className="font-black text-gray-900 text-base truncate">
              {rider.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 font-medium truncate">
                {rider.email}
              </p>
              {rider.phoneNumber && (
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></span>
                  <span className="text-xs font-bold text-gray-700">
                    {rider.phoneNumber}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Driver Profile */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="relative">
            {driver.profilePicture && !driverImgBroken ? (
              <img
                src={driver.profilePicture}
                onError={() => setDriverImgBroken(true)}
                className="h-14 w-14 rounded-2xl object-cover border-4 border-white shadow-md"
                alt="driver-avatar"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl border-4 border-white shadow-md bg-amber-500 flex items-center justify-center text-white font-black text-xl">
                {driverInitial}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">
                Driver
              </p>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-600 text-[10px] font-bold shadow-sm">
                <MdStar className="text-sm" /> {driver.averageRating}
              </div>
            </div>
            <h4 className="font-black text-gray-900 text-base truncate">
              {driver.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 font-medium truncate">
                {driver.email}
              </p>
              {driver.phoneNumber && (
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></span>
                  <span className="text-xs font-bold text-gray-700">
                    {driver.phoneNumber}
                  </span>
                </>
              )}
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md border border-blue-100 uppercase tracking-wider">
                {driver.totalRides} Rides
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
