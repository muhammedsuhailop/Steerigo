import React, { useEffect, useState } from "react";
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
  onChange?: (formData: TripFormData) => void;
  isLoading?: boolean;
}

const Pill: React.FC<{ children: React.ReactNode; active: boolean }> = ({
  children,
  active,
}) => (
  <button
    className={`px-6 py-2 rounded-full font-semibold transition ${
      active
        ? "bg-gray-800 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {children}
  </button>
);

const LocationPreview: React.FC<{
  label: string;
  location: Location | null;
  onEdit: () => void;
  onClear: () => void;
}> = ({ label, location, onEdit, onClear }) => {
  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 mb-2">
        {location?.address || "Selected location"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium"
        >
          Change
        </button>
        <button
          onClick={onClear}
          className="flex-1 px-3 py-1 text-xs bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const DriverSearchForm: React.FC<DriverSearchFormProps> = ({
  onSubmit,
  onChange,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TripFormData>({
    tripType: "oneway",
    pickupLocation: null,
    dropLocation: null,
    rideStartDate: "",
    rideStartTime: "",
    searchRadiusKm: 25,
    gearType: "Manual",
    bodyType: "Sedan",
    timeRequired: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default date and time
  useEffect(() => {
    const now = new Date();
    const dateOnly = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);
    setFormData((p) => ({
      ...p,
      rideStartDate: dateOnly,
      rideStartTime: timeStr,
    }));
  }, []);

  // Notify parent of changes in real-time
  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pickupLocation)
      newErrors.pickupLocation = "Pickup location is required";
    if (formData.tripType === "oneway" && !formData.dropLocation)
      newErrors.dropLocation = "Drop location is required for one-way trips";
    if (!formData.rideStartDate)
      newErrors.rideStartDate = "Ride start date is required";
    if (!formData.rideStartTime)
      newErrors.rideStartTime = "Ride start time is required";
    if (
      !formData.timeRequired ||
      formData.timeRequired < 1 ||
      formData.timeRequired > 24
    )
      newErrors.timeRequired = "Please select required hours (1–24)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const handlePickupLocationChange = (location: Location | null) => {
    setFormData((prev) => ({ ...prev, pickupLocation: location }));
    if (errors.pickupLocation) setErrors((p) => ({ ...p, pickupLocation: "" }));
  };

  const handleDropLocationChange = (location: Location | null) => {
    setFormData((prev) => ({ ...prev, dropLocation: location }));
    if (errors.dropLocation) setErrors((p) => ({ ...p, dropLocation: "" }));
  };

  const setTripType = (type: "oneway" | "roundtrip") => {
    setFormData((p) => ({
      ...p,
      tripType: type,
      dropLocation: type === "roundtrip" ? null : p.dropLocation,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <FaCar className="text-gray-700" />
          Find Your Driver
        </h2>
        <p className="text-sm text-gray-600">
          Fill in the details to search for available drivers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <FaRoute className="inline mr-2 text-gray-600" />
            Trip Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTripType("oneway")}
              className={`px-4 py-3 rounded-lg border-2 font-bold transition ${
                formData.tripType === "oneway"
                  ? "border-gray-700 bg-gray-50 text-gray-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType("roundtrip")}
              className={`px-4 py-3 rounded-lg border-2 font-bold transition ${
                formData.tripType === "roundtrip"
                  ? "border-gray-700 bg-gray-50 text-gray-800"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          {formData.pickupLocation ? (
            <LocationPreview
              label="Pickup Location"
              location={formData.pickupLocation}
              onEdit={() => handlePickupLocationChange(formData.pickupLocation)}
              onClear={() => handlePickupLocationChange(null)}
            />
          ) : (
            <>
              <MapLocationInput
                label="Pickup Location"
                value={formData.pickupLocation}
                onChange={handlePickupLocationChange}
                placeholder="Search for pickup location"
                required
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pickupLocation}
                </p>
              )}
            </>
          )}
        </div>

        {/* Drop Location (Only for One Way) */}
        {formData.tripType === "oneway" && (
          <div>
            {formData.dropLocation ? (
              <LocationPreview
                label="Drop Location"
                location={formData.dropLocation}
                onEdit={() => handleDropLocationChange(formData.dropLocation)}
                onClear={() => handleDropLocationChange(null)}
              />
            ) : (
              <>
                <MapLocationInput
                  label="Drop Location"
                  value={formData.dropLocation}
                  onChange={handleDropLocationChange}
                  placeholder="Search for drop location"
                  required
                />
                {errors.dropLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dropLocation}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Date and Time in one row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gray-600" />
              Date
            </label>
            <input
              type="date"
              value={formData.rideStartDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, rideStartDate: e.target.value }))
              }
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.rideStartDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rideStartDate}
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaClock className="inline mr-2 text-gray-600" />
              Time
            </label>
            <input
              type="time"
              value={formData.rideStartTime}
              onChange={(e) =>
                setFormData((p) => ({ ...p, rideStartTime: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.rideStartTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rideStartTime}
              </p>
            )}
          </div>
        </div>

        {/* Required time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FaClock className="inline mr-2 text-gray-600" />
            Required Time
          </label>
          <select
            value={formData.timeRequired}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                timeRequired: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>
                {h} {h === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
          {errors.timeRequired && (
            <p className="text-red-500 text-xs mt-1">{errors.timeRequired}</p>
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
            max="50"
            step="5"
            value={formData.searchRadiusKm}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                searchRadiusKm: Number(e.target.value),
              }))
            }
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-gray-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Gear and Body Type */}
        <div className="grid grid-cols-2 gap-4">
          {/* Gear Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaCog className="inline mr-2 text-gray-600" />
              Gear Type
            </label>
            <select
              value={formData.gearType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gearType: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaCar className="inline mr-2 text-gray-600" />
              Body Type
            </label>
            <select
              value={formData.bodyType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, bodyType: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-600 to-gray-800 hover:opacity-95"
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
