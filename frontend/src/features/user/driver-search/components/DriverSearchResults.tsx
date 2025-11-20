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
  requestedDriverIds?: Set<string>;
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
  requestedDriverIds = new Set(),
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center">
          <FaExclamationCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search radius or filters
          </p>
        </div>
      </div>
    );
  }

  // No Results State
  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center">
          <FaCar className="text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Drivers Found
          </h3>
          <p className="text-gray-600 mb-2">
            No available drivers found within {searchRadius} km of your
            location.
          </p>
          <p className="text-sm text-gray-500">
            Try increasing your search radius or adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {totalFound} Driver{totalFound !== 1 ? "s" : ""} Found
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Within {searchRadius} km of pickup location
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <FaMapMarkerAlt className="text-gray-400" />
              <span>{pickupAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Fare */}
      {estimatedFare && <FareBreakdown fare={estimatedFare} />}

      {/* Driver Cards Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Available Drivers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onViewDetails={handleViewDetails}
              onSendRequest={handleSendRequest}
              isRequested={requestedDriverIds.has(driver.id)}
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
          isRequested={requestedDriverIds.has(selectedDriver.id)}
        />
      )}
    </div>
  );
};

export default DriverSearchResults;
