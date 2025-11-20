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
  FaPaperPlane,
} from "react-icons/fa";
import type { Driver } from "../types/driverSearch.types";

interface DriverDetailModalProps {
  driver: Driver;
  onClose: () => void;
  onCall?: (driver: Driver) => void;
  onSendRequest?: (driver: Driver) => void;
  isRequested?: boolean;
}

const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  driver,
  onClose,
  onCall,
  onSendRequest,
  isRequested = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Driver Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {driver.name}
            </h3>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {driver.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500">{driver.totalRides} trips</span>
            </div>

            {/* Status Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <FaCheckCircle />
              {driver.availabilityStatus}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaCar className="text-gray-600" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Body Type</p>
                <p className="font-semibold text-gray-900">{driver.bodyType}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Gear Type</p>
                <p className="font-semibold text-gray-900">{driver.gearType}</p>
              </div>
            </div>
          </div>

          {/* Distance & ETA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FaRoad />
                <span className="text-sm font-medium">Distance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {driver.distance.value.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {driver.distance.unit}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FaClock />
                <span className="text-sm font-medium">ETA</span>
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-600" />
              Current Location
            </h4>
            <p className="text-sm text-gray-600">
              {driver.currentLocation.address}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FaPhone className="text-gray-600" />
              Contact
            </h4>
            <p className="text-sm text-gray-600">{driver.mobile}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={() => onCall?.(driver)}
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhone />
            Call Driver
          </button>

          {isRequested ? (
            <button
              disabled
              className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg cursor-not-allowed opacity-90 flex items-center justify-center gap-2"
              aria-label="Request already sent"
            >
              <FaCheckCircle />
              Requested
            </button>
          ) : (
            <button
              onClick={() => onSendRequest?.(driver)}
              className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              aria-label="Request Ride"
            >
              <FaPaperPlane />
              Request Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
