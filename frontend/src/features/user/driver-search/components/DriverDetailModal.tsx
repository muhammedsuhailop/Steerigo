import React from "react";
import {
  FaTimes,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaCar,
  FaRoad,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import type { Driver } from "../types/driverSearch.types";

interface DriverDetailModalProps {
  driver: Driver;
  onClose: () => void;
  onCall?: (driver: Driver) => void;
  onSelectDriver?: (driver: Driver) => void;
}

const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  driver,
  onClose,
  onCall,
  onSelectDriver,
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl
            [scrollbar-width:none] [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Driver Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <img
              src={driver.profilePicture || "/default-avatar.png"}
              alt={driver.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {driver.name}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FaStar className="text-amber-500" />
                  {driver.rating.toFixed(1)}
                </div>
                <span className="text-sm text-gray-500">
                  {driver.totalRides} trips
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span className="text-green-700 font-medium">
              {driver.availabilityStatus}
            </span>
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaCar className="text-gray-600" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Body Type</p>
                <p className="font-medium text-gray-900">{driver.bodyType}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Gear Type</p>
                <p className="font-medium text-gray-900">{driver.gearType}</p>
              </div>
            </div>
          </div>

          {/* Distance & ETA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FaRoad />
                <span className="text-xs font-medium uppercase">Distance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {driver.distance.value.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {driver.distance.unit}
                </span>
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <FaClock />
                <span className="text-xs font-medium uppercase">ETA</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {driver.eta.value}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {driver.eta.unit}
                </span>
              </p>
            </div>
          </div>

          {/* Current Location */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <FaMapMarkerAlt className="text-gray-600" />
              Current Location
            </h4>
            <p className="text-sm text-gray-600">
              {driver.currentLocation.address}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <FaPhone className="text-gray-600" />
              Contact
            </h4>
            <p className="text-sm font-medium text-gray-900">{driver.mobile}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={() => onCall?.(driver)}
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhone />
            Call Driver
          </button>
          <button
            onClick={() => onSelectDriver?.(driver)}
            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Select Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
