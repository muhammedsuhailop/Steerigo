import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaMap,
  FaList,
  FaTimesCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaCar,
  FaStar,
} from "react-icons/fa";
import DriverCard from "./DriverCard";
import DriverSearchMap from "./DriverSearchMap";
import {
  selectDrivers,
  selectIsLoading,
  selectError,
  selectSearchCriteria,
  selectTotalFound,
  clearSearch,
} from "../store/driverSearchSlice";
import type { Driver } from "../types/driverSearch.types";

interface DriverSearchResultsProps {
  onClearSearch?: () => void;
  initialViewMode?: "map" | "list";
}

const DriverSearchResults: React.FC<DriverSearchResultsProps> = ({
  onClearSearch,
  initialViewMode = "map",
}) => {
  const dispatch = useDispatch();

  const drivers = useSelector(selectDrivers) ?? [];
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const searchCriteria = useSelector(selectSearchCriteria);
  const totalFound = useSelector(selectTotalFound) ?? 0;

  // Local state
  const [viewMode, setViewMode] = useState<"map" | "list">(initialViewMode);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleDriverSelect = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
  }, []);

  const handleCallDriver = useCallback((driver: Driver) => {
    window.location.href = `tel:${driver.mobile}`;
  }, []);

  const handleBackToSearch = useCallback(() => {
    dispatch(clearSearch());
    onClearSearch?.();
  }, [dispatch, onClearSearch]);

  const handleConfirmBooking = useCallback(() => {
    if (!selectedDriver) return;
    // TODO:
    alert(`Booking ${selectedDriver.name}...`);
  }, [selectedDriver]);

  // Don't render if no search has been performed
  if (!searchCriteria) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToSearch}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            title="Clear Search"
            aria-label="Clear Search"
          >
            <FaArrowLeft className="text-gray-700 w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Drivers
            </h2>
            <div className="flex items-start gap-2 text-gray-600 mt-1">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium text-sm">
                  {totalFound} driver{totalFound !== 1 ? "s" : ""} found within{" "}
                  {searchCriteria.searchRadiusKm} km
                </p>
                <p className="text-xs mt-1 text-gray-600">
                  {searchCriteria.pickupLocation.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-gray-400 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && drivers.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FaTimesCircle className="mx-auto h-24 w-24" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Drivers Found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search radius or filters
          </p>
          <button
            onClick={handleBackToSearch}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Modify Search
          </button>
        </div>
      )}

      {/* Results Content */}
      {!isLoading && !error && drivers.length > 0 && (
        <>
          {/* Search Summary Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Found{" "}
                  <span className="font-bold text-gray-900">{totalFound}</span>{" "}
                  available {totalFound === 1 ? "driver" : "drivers"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-medium">
                    {searchCriteria.tripType === "oneway"
                      ? "One Way"
                      : "Round Trip"}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                    {searchCriteria.searchRadiusKm} km radius
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                    {searchCriteria.gearType}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                    {searchCriteria.bodyType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("map")}
                    aria-pressed={viewMode === "map"}
                    className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 text-sm ${
                      viewMode === "map"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaMap className="text-gray-600" /> <span>Map</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-pressed={viewMode === "list"}
                    className={`px-4 py-2 rounded font-semibold transition flex items-center gap-2 text-sm ${
                      viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaList className="text-gray-600" /> <span>List</span>
                  </button>
                </div>

                {/* Clear Search Button */}
                <button
                  onClick={handleBackToSearch}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-sm"
                  aria-label="Clear search"
                >
                  New Search
                </button>
              </div>
            </div>

            {/* Drop Location for One-Way Trips */}
            {searchCriteria.tripType === "oneway" &&
              searchCriteria.dropLocation && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span className="font-semibold">Drop Location:</span>
                  </span>
                  <p className="text-sm text-gray-900 mt-1 ml-6">
                    {searchCriteria.dropLocation.address}
                  </p>
                </div>
              )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {viewMode === "map" ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <DriverSearchMap
                    drivers={drivers}
                    userLocation={searchCriteria.pickupLocation}
                    searchRadius={searchCriteria.searchRadiusKm}
                    onDriverSelect={handleDriverSelect}
                  />
                </div>
              ) : (
                <div className="grid gap-4">
                  {drivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onSelect={handleDriverSelect}
                      onCall={handleCallDriver}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Selected Driver Sidebar */}
            <div className="sticky top-4 h-fit">
              {selectedDriver ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-gray-700" />
                    Selected Driver
                  </h3>

                  {/* Driver Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-2xl">
                        {selectedDriver.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {selectedDriver.name}
                        </h4>
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaStar className="text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedDriver.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-600 ml-1">
                            ({selectedDriver.totalRides} rides)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600 text-xs mb-1">
                          Body Type
                        </div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <FaCar className="text-gray-600" />
                          {selectedDriver.bodyType}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600 text-xs mb-1">
                          Gear Type
                        </div>
                        <div className="font-semibold text-gray-900">
                          {selectedDriver.gearType}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600 text-xs mb-1">
                          Distance
                        </div>
                        <div className="font-semibold text-gray-900">
                          {selectedDriver.distance.value.toFixed(1)}{" "}
                          {selectedDriver.distance.unit}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600 text-xs mb-1">ETA</div>
                        <div className="font-semibold text-gray-900">
                          {selectedDriver.eta.value} {selectedDriver.eta.unit}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">
                        Status
                      </span>
                      <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
                        {selectedDriver.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleCallDriver(selectedDriver)}
                      className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                    >
                      <FaPhone />
                      Call Driver
                    </button>
                  </div>

                  {/* Next Steps */}
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-800 font-semibold mb-3">
                      Next Steps:
                    </p>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Confirm your ride details</li>
                      <li>2. Set payment method</li>
                      <li>3. Confirm booking</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <FaTimesCircle className="text-gray-400 w-12 h-12 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold mb-2">
                    No driver selected
                  </p>
                  <p className="text-sm text-gray-500">
                    Click on a driver card or map marker to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverSearchResults;
