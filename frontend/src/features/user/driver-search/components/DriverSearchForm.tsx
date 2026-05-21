import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaCar,
  FaClock,
  FaCog,
  FaSearch,
  FaCircle,
  FaSquareFull,
  FaBolt,
} from "react-icons/fa";
import { TripFormData } from "../types/driverSearch.types";
import { Location } from "@/shared/types/ride.types";
import LocationPreview from "./LocationPreview";

interface DriverSearchFormProps {
  onSubmit: (formData: TripFormData) => void;
  onAutoRequest: (formData: TripFormData) => void;
  onChange?: (formData: TripFormData) => void;
  isLoading?: boolean;
  onOpenLocationSearch: (type: "pickup" | "drop") => void;
  externalPickup: Location | null;
  externalDrop: Location | null;
  onClearLocation: (type: "pickup" | "drop") => void;
}

const DriverSearchForm: React.FC<DriverSearchFormProps> = ({
  onSubmit,
  onAutoRequest,
  onChange,
  isLoading = false,
  onOpenLocationSearch,
  externalPickup,
  externalDrop,
  onClearLocation,
}) => {
  // Simplified state: No manual dates, just offsets and durations
  const [formData, setFormData] = useState({
    tripType: "oneway" as "oneway" | "roundtrip",
    startTimeOffset: 30,
    timeRequired: 1,
    searchRadiusKm: 25,
    gearType: "Manual",
    bodyType: "Sedan",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFullData = useCallback((): TripFormData => {
    const startMs = Date.now() + formData.startTimeOffset * 60000;
    const startDate = new Date(startMs);

    const endMs = startMs + formData.timeRequired * 60 * 60 * 1000;
    const endDate = new Date(endMs);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const formatTime = (d: Date) =>
      `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    return {
      tripType: formData.tripType,
      rideStartDate: formatDate(startDate),
      rideStartTime: formatTime(startDate),
      rideEndDate: formatDate(endDate),
      rideEndTime: formatTime(endDate),
      searchRadiusKm: formData.searchRadiusKm,
      gearType: formData.gearType,
      bodyType: formData.bodyType,
      timeRequired: formData.timeRequired,
      pickupLocation: externalPickup,
      dropLocation: externalDrop,
    };
  }, [formData, externalPickup, externalDrop]);

  // Emit changes to the parent page (for the map preview)
  const lastEmitted = useRef("");
  useEffect(() => {
    const currentData = getFullData();
    const dataStr = JSON.stringify(currentData);
    if (lastEmitted.current !== dataStr) {
      lastEmitted.current = dataStr;
      onChange?.(currentData);
    }
  }, [getFullData, onChange]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!externalPickup)
      newErrors.pickupLocation = "Pickup location is required";
    if (formData.tripType === "oneway" && !externalDrop)
      newErrors.dropLocation = "Drop location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(getFullData());
  };

  const handleAutoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validate()) onAutoRequest(getFullData());
  };

  return (
    <div className="bg-white rounded-2xl p-6 ring-1 ring-gray-100">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <FaCar className="text-gray-700" /> Find Your Driver
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Trip Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Trip Type
          </label>
          <div className="flex gap-2">
            {(["oneway", "roundtrip"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, tripType: type }))}
                className={`text-sm px-3 py-1 rounded-md transition ${
                  formData.tripType === type
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "oneway" ? "One Way" : "Round Trip"}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-3">
          {/* Pickup */}
          <div>
            {externalPickup ? (
              <LocationPreview
                label="Pickup"
                location={externalPickup}
                onEdit={() => onOpenLocationSearch("pickup")}
                onClear={() => onClearLocation("pickup")}
              />
            ) : (
              <button
                type="button"
                onClick={() => onOpenLocationSearch("pickup")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm hover:bg-gray-100 transition"
              >
                <FaCircle className="text-green-500 text-[10px]" />
                <span className="text-gray-500">Select pickup location</span>
                <FaSearch className="ml-auto text-gray-400 text-xs" />
              </button>
            )}

            {errors.pickupLocation && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.pickupLocation}
              </p>
            )}
          </div>

          {/* Drop */}
          {formData.tripType === "oneway" && (
            <div>
              {externalDrop ? (
                <LocationPreview
                  label="Drop"
                  location={externalDrop}
                  onEdit={() => onOpenLocationSearch("drop")}
                  onClear={() => onClearLocation("drop")}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenLocationSearch("drop")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm hover:bg-gray-100 transition"
                >
                  <FaSquareFull className="text-red-500 text-[10px]" />
                  <span className="text-gray-500">Select drop location</span>
                  <FaSearch className="ml-auto text-gray-400 text-xs" />
                </button>
              )}

              {errors.dropLocation && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.dropLocation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Simplified Timing Options */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaClock className="text-gray-500" /> Pickup Time
            </label>
            <select
              value={formData.startTimeOffset}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  startTimeOffset: Number(e.target.value),
                }))
              }
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
            >
              <option value={15}>In 15 minutes</option>
              <option value={30}>In 30 minutes</option>
              <option value={45}>In 45 minutes</option>
              <option value={60}>In 1 hour</option>
              <option value={90}>In 1.5 hours</option>
              <option value={120}>In 2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaClock className="text-gray-500" /> Duration
            </label>
            <select
              value={formData.timeRequired}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  timeRequired: Number(e.target.value),
                }))
              }
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h} {h === 1 ? "hour" : "hours"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Radius */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Search Radius:{" "}
            <span className="font-medium text-gray-800">
              {formData.searchRadiusKm} km
            </span>
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
            className="w-full h-2 accent-gray-700 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-500 mt-1">
            <span>5 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Gear and Body Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCog className="text-gray-500" /> Gear Type
            </label>
            <select
              value={formData.gearType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gearType: e.target.value }))
              }
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCar className="text-gray-500" /> Body Type
            </label>
            <select
              value={formData.bodyType}
              onChange={(e) =>
                setFormData((p) => ({ ...p, bodyType: e.target.value }))
              }
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
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
          type="button"
          onClick={handleAutoClick}
          disabled={isLoading}
          aria-busy={isLoading}
          className={`w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isLoading
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : "bg-gray-900 text-white border border-gray-600 hover:bg-gray-700 active:scale-[0.98] shadow-md hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
              Requesting...
            </>
          ) : (
            <>
              <FaBolt className="text-yellow-300 text-lg" />
              Quick Ride Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DriverSearchForm;
