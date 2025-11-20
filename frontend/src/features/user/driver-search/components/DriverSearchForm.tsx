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
    className={`text-sm px-3 py-1 rounded-full font-semibold transition-shadow ${
      active
        ? "bg-gray-900 text-white shadow-sm"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

/* location preview  */
const LocationPreview: React.FC<{
  label: string;
  location: Location | null;
  onEdit: () => void;
  onClear: () => void;
}> = ({ label, location, onEdit, onClear }) => {
  return (
    <div className="p-3 bg-gray-50 ring-1 ring-gray-100 rounded-lg">
      <p className="text-[11px] font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mb-3">
        {location?.address || "Selected location"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-2 py-1 text-xs bg-gray-800 text-white rounded-md hover:opacity-95 transition"
        >
          Change
        </button>
        <button
          onClick={onClear}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
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
    rideEndDate: "",
    rideEndTime: "",
    searchRadiusKm: 25,
    gearType: "Manual",
    bodyType: "Sedan",
    timeRequired: 1, // hours
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isManualEnd, setIsManualEnd] = useState<boolean>(false);

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    setFormData((p) => ({
      ...p,
      rideStartDate: formatDate(now),
      rideStartTime: formatTime(now),
    }));
  }, []);

  useEffect(() => {
    if (isManualEnd) return;
    if (!formData.rideStartDate || !formData.rideStartTime) return;

    const startISO = `${formData.rideStartDate}T${formData.rideStartTime}:00`;
    const startDate = new Date(startISO);
    if (Number.isNaN(startDate.getTime())) return;

    const ms = (formData.timeRequired ?? 1) * 60 * 60 * 1000;
    const endDate = new Date(startDate.getTime() + ms);
    setFormData((p) => ({
      ...p,
      rideEndDate: formatDate(endDate),
      rideEndTime: formatTime(endDate),
    }));
  }, [
    formData.rideStartDate,
    formData.rideStartTime,
    formData.timeRequired,
    isManualEnd,
  ]);

  useEffect(() => {
    if (!isManualEnd) return;
    if (!formData.rideStartDate || !formData.rideStartTime) return;
    if (!formData.rideEndDate || !formData.rideEndTime) return;

    const start = new Date(
      `${formData.rideStartDate}T${formData.rideStartTime}:00`
    );
    const end = new Date(`${formData.rideEndDate}T${formData.rideEndTime}:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

    const diffMin = Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (60 * 1000))
    );
    const hours = Math.max(1, Math.min(24, Math.ceil(diffMin / 60)));
    setFormData((p) => ({ ...p, timeRequired: hours }));
  }, [
    formData.rideEndDate,
    formData.rideEndTime,
    formData.rideStartDate,
    formData.rideStartTime,
    isManualEnd,
  ]);

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

    if (formData.rideEndDate && formData.rideEndTime) {
      const start = new Date(
        `${formData.rideStartDate}T${formData.rideStartTime}:00`
      );
      const end = new Date(
        `${formData.rideEndDate}T${formData.rideEndTime}:00`
      );
      if (end.getTime() < start.getTime())
        newErrors.rideEndDate = "End date/time must be after start date/time";
    }

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

  const handleToggleManualEnd = (checked: boolean) => {
    setIsManualEnd(checked);
    if (checked) {
      if (!formData.rideEndDate || !formData.rideEndTime) {
        const startISO = `${formData.rideStartDate}T${formData.rideStartTime}:00`;
        const startDate = new Date(startISO);
        if (!Number.isNaN(startDate.getTime())) {
          const ms = (formData.timeRequired ?? 1) * 60 * 60 * 1000;
          const endDate = new Date(startDate.getTime() + ms);
          setFormData((p) => ({
            ...p,
            rideEndDate: formatDate(endDate),
            rideEndTime: formatTime(endDate),
          }));
        }
      }
    }
  };

  const onChangeRideStartDate = (value: string) =>
    setFormData((p) => ({ ...p, rideStartDate: value }));
  const onChangeRideStartTime = (value: string) =>
    setFormData((p) => ({ ...p, rideStartTime: value }));
  const onChangeRideEndDate = (value: string) =>
    setFormData((p) => ({ ...p, rideEndDate: value }));
  const onChangeRideEndTime = (value: string) =>
    setFormData((p) => ({ ...p, rideEndTime: value }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-gray-100">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-1">
          <FaCar className="text-gray-700" />
          Find Your Nearest Driver
        </h2>
        <p className="text-xs text-gray-500">
          Fill in the details to search for available drivers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Trip Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <FaRoute className="text-gray-500" />
            Trip Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTripType("oneway")}
              className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                formData.tripType === "oneway"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType("roundtrip")}
              className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                formData.tripType === "roundtrip"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
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
                <p className="text-rose-500 text-xs mt-1">
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
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.dropLocation}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Start Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" /> Start Date
            </label>
            <input
              type="date"
              value={formData.rideStartDate}
              onChange={(e) => onChangeRideStartDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
            {errors.rideStartDate && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.rideStartDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaClock className="text-gray-500" /> Start Time
            </label>
            <input
              type="time"
              value={formData.rideStartTime}
              onChange={(e) => onChangeRideStartTime(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
            {errors.rideStartTime && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.rideStartTime}
              </p>
            )}
          </div>
        </div>

        {/* Required time | Manual checkbox | End Date | End Time */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Timing
          </label>

          <div className="grid grid-cols-4 gap-3 items-end">
            {/* Required Time */}
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">
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
                disabled={isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white disabled:opacity-60"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h} {h === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>

            {/* Manual toggle + computed duration */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="manual-end"
                  type="checkbox"
                  checked={isManualEnd}
                  onChange={(e) => handleToggleManualEnd(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="manual-end" className="text-xs text-gray-600">
                  Set end manually
                </label>
              </div>

              {isManualEnd && (
                <div className="ml-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-800">
                    {formData.timeRequired}
                  </span>{" "}
                  <span className="text-gray-500">
                    {formData.timeRequired === 1 ? "hr" : "hrs"}
                  </span>
                </div>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={formData.rideEndDate}
                onChange={(e) => onChangeRideEndDate(e.target.value)}
                min={
                  formData.rideStartDate ||
                  new Date().toISOString().slice(0, 10)
                }
                disabled={!isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 disabled:opacity-60"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">
                End Time
              </label>
              <input
                type="time"
                value={formData.rideEndTime}
                onChange={(e) => onChangeRideEndTime(e.target.value)}
                disabled={!isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 disabled:opacity-60"
              />
            </div>
          </div>

          {errors.timeRequired && (
            <p className="text-rose-500 text-xs mt-2">{errors.timeRequired}</p>
          )}
          {errors.rideEndDate && (
            <p className="text-rose-500 text-xs mt-1">{errors.rideEndDate}</p>
          )}
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
            className="w-full h-2 accent-gray-700"
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
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
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
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
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
          className={`w-full h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-800 to-gray-900 hover:opacity-95"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
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
