import React, { useState } from "react";
import { FaStar, FaCar, FaEye, FaPaperPlane } from "react-icons/fa";
import type { Driver } from "../types/driverSearch.types";

interface DriverCardProps {
  driver: Driver;
  onViewDetails?: (driver: Driver) => void;
  onSendRequest?: (driver: Driver) => void | Promise<void>;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onViewDetails,
  onSendRequest,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendRequest = async (): Promise<void> => {
    if (!onSendRequest) return;

    try {
      setIsSending(true);
      const result = onSendRequest(driver);
      if (result && typeof (result as Promise<void>).then === "function") {
        await result;
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={driver.profilePicture || "/default-avatar.png"}
          alt={driver.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-base truncate">
              {driver.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
              <FaStar className="text-amber-500 text-xs" />
              {driver.rating.toFixed(1)}
            </div>
          </div>
          <p className="text-xs text-gray-500">{driver.totalRides} trips</p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <FaCar className="text-gray-400" />
        <span>
          {driver.bodyType} • {driver.gearType}
        </span>
      </div>

      {/* Distance & ETA */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-0.5">Distance</p>
          <p className="text-sm font-semibold text-gray-900">
            {driver.distance.value.toFixed(1)} {driver.distance.unit}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-0.5">ETA</p>
          <p className="text-sm font-semibold text-gray-900">
            {driver.eta.value} {driver.eta.unit}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => onViewDetails?.(driver)}
          className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 
               text-gray-800 font-medium py-1.5 px-2 text-xs rounded-md 
               transition-colors duration-200"
          aria-label={`View details for ${driver.name}`}
        >
          <FaEye className="text-[10px]" />
          <span>View</span>
        </button>

        <button
          onClick={handleSendRequest}
          disabled={isSending}
          className={`flex items-center justify-center gap-1.5 
            text-white font-medium py-1.5 px-2 text-xs rounded-md 
            transition-colors duration-200
            ${
              isSending
                ? "bg-gray-700 opacity-70 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }
          `}
          aria-label={`Request ride from ${driver.name}`}
        >
          <FaPaperPlane className="text-[10px]" />
          <span>{isSending ? "Sending..." : "Request Ride"}</span>
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
