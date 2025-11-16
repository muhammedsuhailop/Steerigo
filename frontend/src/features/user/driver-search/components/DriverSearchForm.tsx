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
  isLoading?: boolean;
}

const Pill: React.FC<React.PropsWithChildren<{ active?: boolean }>> = ({
  children,
  active,
}) => (
  <div
    className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow transition-colors select-none whitespace-nowrap ${
      active
        ? "bg-gradient-to-r from-gray-400 to-gray-700 text-white shadow-lg"
        : "bg-white/60 text-gray-700 hover:shadow-sm"
    }`}
  >
    {children}
  </div>
);

const LocationPreview: React.FC<{
  label: string;
  location: Location | null;
  onEdit: () => void;
  onClear: () => void;
}> = ({ label, location, onEdit, onClear }) => {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-white">
      <div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-800 mt-1 max-w-xs truncate">
          {location?.address || "Selected location"}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-xs px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700"
        >
          Change
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${label} location`}
          className="text-xs px-3 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

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
    searchRadiusKm: 25,
    gearType: "Manual",
    bodyType: "Sedan",
    timeRequired: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100"
    >
      <header className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-tr from-gray-50 to-gray-100">
          <FaCar className="text-gray-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Find Your Driver
          </h3>
        </div>
      </header>

      {/* Trip Type */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 flex items-center gap-2 mb-3">
          <FaRoute /> Trip Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTripType("oneway")}
            aria-pressed={formData.tripType === "oneway"}
            className="flex-1"
          >
            <Pill active={formData.tripType === "oneway"}>One Way</Pill>
          </button>

          <button
            type="button"
            onClick={() => setTripType("roundtrip")}
            aria-pressed={formData.tripType === "roundtrip"}
            className="flex-1"
          >
            <Pill active={formData.tripType === "roundtrip"}>Round Trip</Pill>
          </button>
        </div>
      </div>

      {/* Pickup */}
      <div className="mb-4">
        {formData.pickupLocation ? (
          <LocationPreview
            label="Pickup"
            location={formData.pickupLocation}
            onEdit={() => setFormData((p) => ({ ...p, pickupLocation: null }))}
            onClear={() => setFormData((p) => ({ ...p, pickupLocation: null }))}
          />
        ) : (
          <div>
            <MapLocationInput
              label="Pickup"
              value={formData.pickupLocation}
              onChange={handlePickupLocationChange}
              placeholder="Where from..."
              required
            />
            {errors.pickupLocation && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.pickupLocation}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Drop (only for oneway) */}
      {formData.tripType === "oneway" && (
        <div className="mb-4">
          {formData.dropLocation ? (
            <LocationPreview
              label="Drop"
              location={formData.dropLocation}
              onEdit={() => setFormData((p) => ({ ...p, dropLocation: null }))}
              onClear={() => setFormData((p) => ({ ...p, dropLocation: null }))}
            />
          ) : (
            <div>
              <MapLocationInput
                label="Drop"
                value={formData.dropLocation}
                onChange={handleDropLocationChange}
                placeholder="Where to..."
                required
              />
              {errors.dropLocation && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.dropLocation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Date / Time / TimeRequired */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Date */}
        <div>
          <label className="text-xs font-medium text-gray-600 flex items-center gap-2 mb-2">
            <FaCalendarAlt /> Date
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
            <p className="text-rose-500 text-xs mt-1">{errors.rideStartDate}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="text-xs font-medium text-gray-600 flex items-center gap-2 mb-2">
            <FaClock /> Time
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
            <p className="text-rose-500 text-xs mt-1">{errors.rideStartTime}</p>
          )}
        </div>
      </div>

      {/* Time required (1-24 hrs) — placed below date/time */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-2">
          Required time
        </label>
        <select
          value={formData.timeRequired}
          onChange={(e) =>
            setFormData((p) => ({ ...p, timeRequired: Number(e.target.value) }))
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h} {h === 1 ? "hour" : "hours"}
            </option>
          ))}
        </select>
        {errors.timeRequired && (
          <p className="text-rose-500 text-xs mt-1">{errors.timeRequired}</p>
        )}
      </div>

      {/* Radius */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-2">
          Search radius — {formData.searchRadiusKm} km
        </label>
        <input
          aria-label="Search radius"
          type="range"
          min={5}
          max={50}
          step={5}
          value={formData.searchRadiusKm}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              searchRadiusKm: Number(e.target.value),
            }))
          }
          className="w-full h-2 appearance-none rounded-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Gear / Body */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
            <FaCog /> Gear
          </label>
          <select
            value={formData.gearType}
            onChange={(e) =>
              setFormData((p) => ({ ...p, gearType: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          >
            <option>Manual</option>
            <option>Automatic</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
            <FaCar /> Body
          </label>
          <select
            value={formData.bodyType}
            onChange={(e) =>
              setFormData((p) => ({ ...p, bodyType: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          >
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Premium</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-white transition ${
          isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-gray-600 to-gray-800 hover:opacity-95"
        }`}
      >
        {isLoading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Searching...
          </>
        ) : (
          <>
            <FaSearch /> Search Drivers
          </>
        )}
      </button>
    </form>
  );
};

export default DriverSearchForm;
