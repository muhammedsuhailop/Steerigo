import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaMapPin,
  FaCog,
  FaCarSide,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import type { Location, SearchFormFilters } from "../types/driverSearch.types";

interface SearchFiltersProps {
  onSearch: (filters: SearchFormFilters, location: Location) => void;
  initialLocation?: Location;
  initialFilters?: Partial<SearchFormFilters>;
  isLoading?: boolean;
  onClear?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearch,
  initialLocation,
  initialFilters,
  isLoading = false,
  onClear,
}) => {
  const [location, setLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [filters, setFilters] = useState<SearchFormFilters>({
    radiusKm: initialFilters?.radiusKm || 10,
    gearType: initialFilters?.gearType || "",
    bodyType: initialFilters?.bodyType || "",
    timeRequired: initialFilters?.timeRequired || 60,
  });

  const [showLocationEditor, setShowLocationEditor] = useState(!location);

  const handleFilterChange = (
    field: keyof SearchFormFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]:
        field === "radiusKm" || field === "timeRequired"
          ? Number(value)
          : value,
    }));
  };

  const handleLocationChange = (
    field: keyof Location,
    value: string | number
  ) => {
    if (!location) return;
    setLocation({
      ...location,
      [field]: field !== "address" ? Number(value) : value,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !location.latitude || !location.longitude) {
      alert("Please set a valid location");
      return;
    }
    onSearch(filters, location);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Current Location",
        });
        setShowLocationEditor(false);
      },
      (error) => {
        console.error("Error getting current location:", error);
        alert("Unable to get your current location. Please enter manually.");
      }
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      {/* Section Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaSearch className="text-blue-600" />
        Search Nearby Drivers
      </h2>

      {/* Location Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="font-semibold text-gray-900 flex items-center gap-2">
            <FaMapPin className="text-red-500" />
            Search Location
          </label>
          {location && (
            <button
              type="button"
              onClick={() => setShowLocationEditor(!showLocationEditor)}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              {showLocationEditor ? "Hide" : "Edit"}
            </button>
          )}
        </div>

        {showLocationEditor ? (
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={location?.latitude || ""}
                  onChange={(e) =>
                    handleLocationChange("latitude", parseFloat(e.target.value))
                  }
                  placeholder="e.g., 11.2815"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={location?.longitude || ""}
                  onChange={(e) =>
                    handleLocationChange(
                      "longitude",
                      parseFloat(e.target.value)
                    )
                  }
                  placeholder="e.g., 75.8436"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={location?.address || ""}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
                placeholder="Enter address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition text-sm"
            >
              📍 Use Current Location
            </button>
          </div>
        ) : location ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900">
              {location.address}
            </p>
            <p className="text-xs text-gray-600">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        ) : null}
      </div>

      {/* Search Radius */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-900 mb-2 text-sm">
          Search Radius:{" "}
          <span className="text-blue-600">{filters.radiusKm} km</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={filters.radiusKm}
          onChange={(e) =>
            handleFilterChange("radiusKm", parseInt(e.target.value))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 km</span>
          <span>100 km</span>
        </div>
      </div>

      {/* Time Required */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
          <FaClock className="text-orange-500" />
          Time Required (minutes)
        </label>
        <input
          type="number"
          min="15"
          max="480"
          step="15"
          value={filters.timeRequired}
          onChange={(e) =>
            handleFilterChange("timeRequired", parseInt(e.target.value))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Vehicle Type Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Gear Type */}
        <div>
          <label className="block font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
            <FaCog className="text-purple-500" />
            Gear Type
          </label>
          <select
            value={filters.gearType}
            onChange={(e) => handleFilterChange("gearType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
            <FaCarSide className="text-green-500" />
            Body Type
          </label>
          <select
            value={filters.bodyType}
            onChange={(e) => handleFilterChange("bodyType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || !location}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <FaSearch /> Search Drivers
            </>
          )}
        </button>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchFilters;
