import React, { useState } from "react";
import { FaMapMarkerAlt, FaCar, FaExclamationCircle } from "react-icons/fa";
import DriverCard from "./DriverCard";
import DriverDetailModal from "./DriverDetailModal";
import FareBreakdown from "./FareBreakdown";
import type { Driver, EstimatedFare } from "../types/driverSearch.types";

interface DriverSearchResultsProps {
  drivers: Driver[];
  estimatedFare: EstimatedFare | null;
  totalFound: number;
  searchRadius: number;
  pickupAddress: string;
  error?: string | null;
  onDriverSelect?: (driver: Driver) => void;
  onDriverCall?: (driver: Driver) => void;
}

const DriverSearchResults: React.FC<DriverSearchResultsProps> = ({
  drivers,
  estimatedFare,
  totalFound,
  searchRadius,
  pickupAddress,
  error,
  onDriverSelect,
  onDriverCall,
}) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleCloseModal = () => {
    setSelectedDriver(null);
  };

  const handleSendRequest = (driver: Driver) => {
    onDriverSelect?.(driver);
    handleCloseModal();
  };

  const handleCallDriver = (driver: Driver) => {
    onDriverCall?.(driver);
  };

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Search Error
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <p className="text-sm text-red-600">
          Try adjusting your search radius or filters
        </p>
      </div>
    );
  }

  // No Results State
  if (drivers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <FaCar className="text-gray-300 text-5xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Drivers Found
        </h3>
        <p className="text-gray-600 mb-4">
          No available drivers found within {searchRadius} km of your location.
        </p>
        <p className="text-sm text-gray-500">
          Try increasing your search radius or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-gray-700 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {totalFound} Driver{totalFound !== 1 ? "s" : ""} Found
            </h3>
            <p className="text-sm text-gray-600">
              Within {searchRadius} km of pickup location
            </p>
            <p className="text-xs text-gray-500 mt-1">{pickupAddress}</p>
          </div>
        </div>
      </div>

      {/* Estimated Fare */}
      {estimatedFare && <FareBreakdown fare={estimatedFare} />}

      {/* Driver Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Drivers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onViewDetails={handleViewDetails}
              onSendRequest={handleSendRequest}
            />
          ))}
        </div>
      </div>

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <DriverDetailModal
          driver={selectedDriver}
          onClose={handleCloseModal}
          onCall={handleCallDriver}
          onSendRequest={handleSendRequest}
        />
      )}
    </div>
  );
};

export default DriverSearchResults;
