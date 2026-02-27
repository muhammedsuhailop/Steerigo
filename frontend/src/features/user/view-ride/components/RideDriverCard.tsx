import React from "react";
import { FaStar, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { DriverInfo } from "../types/viewRide.types";

interface RideDriverCardProps {
  driver: DriverInfo;
}

const maskPhoneNumber = (phone?: string) => {
  if (!phone) return "N/A";
  if (phone.length < 6) return phone;

  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}****${end}`;
};

const RideDriverCard: React.FC<RideDriverCardProps> = ({ driver }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Driver Basic Info */}
      <div className="flex items-center gap-4">
        <img
          src={driver.profilePicture}
          alt={driver.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <FaStar /> 4.8
            <span className="text-gray-400 font-normal">(120+ Rides)</span>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <FaEnvelope className="text-gray-400" />
          <span className="font-medium">{driver.email}</span>
        </div>

        <div className="text-gray-600 text-xs font-medium">
          Mobile: {maskPhoneNumber(driver.phoneNumber)}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed opacity-90"
        >
          <FaCommentDots size={14} />
          Message
        </button>
      </div>
    </div>
  );
};

export default RideDriverCard;
