import React from "react";
import { FaPhone, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { RiderInfo } from "../viewDriverRide.types";

interface RideRiderCardProps {
  rider: RiderInfo;
}

const RideRiderCard: React.FC<RideRiderCardProps> = ({ rider }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={rider.profilePicture}
          alt={rider.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Rider
          </p>
          <h3 className="text-lg font-bold text-gray-900">{rider.name}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            <FaPhone size={14} />
          </div>
          <span className="font-medium">{rider.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            <FaEnvelope size={14} />
          </div>
          <span className="font-medium">{rider.email}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold opacity-90">
          <FaCommentDots size={14} /> Message
        </button>
      </div>
    </div>
  );
};

export default RideRiderCard;
