import { RideTimeline } from "@/shared/types/ride.types";
import React from "react";
import { FaClock, FaMapMarkerAlt, FaHourglassHalf } from "react-icons/fa";

interface LocationInfo {
  address: string;
}

interface RideStatsCardProps {
  timeline: RideTimeline;
  rideType: string;
  pickup: LocationInfo;
  drop: LocationInfo;
}

const RideStatsCard: React.FC<RideStatsCardProps> = ({
  timeline,
  rideType,
  pickup,
  drop,
}) => {
  const calculateTimeTaken = () => {
    if (!timeline.arrivedAt || !timeline.completedAt) return "N/A";

    const start = new Date(timeline.arrivedAt).getTime();
    const end = new Date(timeline.completedAt).getTime();
    const diffInMs = end - start;

    if (diffInMs < 0) return "0 mins";

    const totalMinutes = Math.floor(diffInMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Time Taken Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FaHourglassHalf size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Time Taken
            </p>
            <p className="text-sm font-bold">{calculateTimeTaken()}</p>
          </div>
        </div>

        {/* Ride Type Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <FaClock size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Type
            </p>
            <p className="text-sm font-bold capitalize">{rideType}</p>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="flex gap-4 pt-2 border-t border-gray-50 pt-6">
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
              {pickup.address}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Dropoff
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {drop.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideStatsCard;
