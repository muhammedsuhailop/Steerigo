import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaCog,
  FaSearch,
  FaRoute,
} from "react-icons/fa";
import MapLocationInput from "@/shared/components/maps";
import { TripFormData, Location } from "../types/driverSearch.types";

interface DriverSearchFormProps {
  onSubmit: (formData: TripFormData) => void;
  isLoading?: boolean;
}

const DriverSearchForm: React.FC<DriverSearchFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TripFormData>({
    tripType: "oneway",
    pickupLocation: null,
    dropLocation: null,
    rideStartDate: "",
    rideStartTime: "",
    searchRadiusKm: 50,
    gearType: "Manual",
    bodyType: "Sedan",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default date and time to current
  useEffect(() => {
    const now = new Date();

    // YYYY-MM-DD — safe for <input type="date">
    const dateOnly = now.toISOString().slice(0, 10); // e.g. "2025-11-15"

    // "HH:MM"
    const timeStr = now.toTimeString().slice(0, 5); // e.g. "14:30"

    setFormData((prev) => ({
      ...prev,
      rideStartDate: dateOnly,
      rideStartTime: timeStr,
    }));
  }, []);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (formData.tripType === "oneway" && !formData.dropLocation) {
      newErrors.dropLocation = "Drop location is required for one-way trips";
    }

    if (!formData.rideStartDate) {
      newErrors.rideStartDate = "Ride start date is required";
    }

    if (!formData.rideStartTime) {
      newErrors.rideStartTime = "Ride start time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Handle location changes
  const handlePickupLocationChange = (location: Location) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: location,
    }));
    if (errors.pickupLocation) {
      setErrors((prev) => ({ ...prev, pickupLocation: "" }));
    }
  };

  const handleDropLocationChange = (location: Location) => {
    setFormData((prev) => ({
      ...prev,
      dropLocation: location,
    }));
    if (errors.dropLocation) {
      setErrors((prev) => ({ ...prev, dropLocation: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaCar className="text-blue-600" />
          Find Your Driver
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details to search for available drivers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaRoute className="inline mr-2 text-blue-600" />
            Trip Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, tripType: "oneway" }))
              }
              className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                formData.tripType === "oneway"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  tripType: "roundtrip",
                  dropLocation: null,
                }))
              }
              className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                formData.tripType === "roundtrip"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <MapLocationInput
            label="Pickup Location"
            value={formData.pickupLocation}
            onChange={handlePickupLocationChange}
            placeholder="Search for pickup location"
            required
          />
          {errors.pickupLocation && (
            <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>
          )}
        </div>

        {/* Drop Location (Only for One Way) */}
        {formData.tripType === "oneway" && (
          <div>
            <MapLocationInput
              label="Drop Location"
              value={formData.dropLocation}
              onChange={handleDropLocationChange}
              placeholder="Search for drop location"
              required
            />
            {errors.dropLocation && (
              <p className="text-red-500 text-xs mt-1">{errors.dropLocation}</p>
            )}
          </div>
        )}

        {/* Ride Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaCalendarAlt className="inline mr-2 text-blue-600" />
            Ride Start Date
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            value={formData.rideStartDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                rideStartDate: e.target.value,
              }))
            }
            min={new Date().toISOString().slice(0, 10)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.rideStartDate && (
            <p className="text-red-500 text-xs mt-1">{errors.rideStartDate}</p>
          )}
        </div>

        {/* Ride Start Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaClock className="inline mr-2 text-blue-600" />
            Ride Start Time
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="time"
            value={formData.rideStartTime}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                rideStartTime: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.rideStartTime && (
            <p className="text-red-500 text-xs mt-1">{errors.rideStartTime}</p>
          )}
        </div>

        {/* Search Radius */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Radius: {formData.searchRadiusKm} km
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={formData.searchRadiusKm}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                searchRadiusKm: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Gear Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaCog className="inline mr-2 text-blue-600" />
            Gear Type
          </label>
          <select
            value={formData.gearType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gearType: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaCar className="inline mr-2 text-blue-600" />
            Body Type
          </label>
          <select
            value={formData.bodyType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bodyType: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Searching...
            </>
          ) : (
            <>
              <FaSearch />
              Search Drivers
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DriverSearchForm;
