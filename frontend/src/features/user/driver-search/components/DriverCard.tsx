import React from "react";
import {
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaRoad,
  FaClock,
} from "react-icons/fa";
import { FaGasPump } from "react-icons/fa6";
import type { Driver } from "../types/driverSearch.types";

interface DriverCardProps {
  driver: Driver;
  onSelect?: (driver: Driver) => void;
  onCall?: (driver: Driver) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onSelect,
  onCall,
}) => {
  // Rating chip 
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-gray-100 text-gray-900";
    if (rating >= 4) return "bg-gray-100 text-gray-900";
    if (rating >= 3.5) return "bg-gray-100 text-gray-900";
    return "bg-gray-50 text-gray-700";
  };

  // Availability status 
  const getStatusColor = (status: string) => {
    if (status === "Available")
      return "bg-gray-100 text-gray-800 border-gray-300";
    if (status === "Busy") return "bg-gray-50 text-gray-700 border-gray-300";
    return "bg-gray-50 text-gray-700 border-gray-300";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Name and Rating */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{driver.name}</h3>
          <p className="text-xs text-gray-500">{driver.mobile}</p>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${getRatingColor(
            driver.rating
          )}`}
        >
          <FaStar className="w-3.5 h-3.5 text-gray-600" />
          {driver.rating.toFixed(1)}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
        <div className="grid grid-cols-2 gap-2 text-gray-700">
          <div className="flex items-center gap-1.5">
            <FaGasPump className="text-gray-600 flex-shrink-0" />
            <span>{driver.gearType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRoad className="text-gray-600 flex-shrink-0" />
            <span>{driver.bodyType}</span>
          </div>
          <div className="text-xs col-span-2 text-gray-600">
            ⭐ {driver.totalRides} completed rides
          </div>
        </div>
      </div>

      {/* Distance, ETA, Status */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        {/* Distance */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 font-semibold mb-1">
            <FaMapMarkerAlt className="w-3 h-3" />
            <span className="text-xs">Distance</span>
          </div>
          <div className="font-bold text-gray-900">
            {driver.distance.value.toFixed(1)} {driver.distance.unit}
          </div>
        </div>

        {/* ETA */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600 font-semibold mb-1">
            <FaClock className="w-3 h-3" />
            <span className="text-xs">ETA</span>
          </div>
          <div className="font-bold text-gray-900">
            {driver.eta.value} {driver.eta.unit}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div
            className={`px-2 py-1 rounded-full text-xs font-bold border inline-block ${getStatusColor(
              driver.availabilityStatus
            )}`}
          >
            {driver.availabilityStatus}
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-lg p-2 mb-3 text-xs">
        <div className="flex gap-2">
          <FaMapMarkerAlt className="text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700 line-clamp-2">
            {driver.currentLocation.address}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onCall?.(driver)}
          className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-500 text-gray-900 font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <FaPhone className="w-4 h-4 text-gray-700" />
          <span className="hidden sm:inline">Call</span>
        </button>

        <button
          onClick={() => onSelect?.(driver)}
          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded-lg transition"
        >
          Select Driver
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
