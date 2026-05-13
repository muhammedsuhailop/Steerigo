import React, { useEffect, useRef, useState } from "react";
import {
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaCog,
  FaSearch,
  FaCircle,
  FaSquareFull,
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";

import { TripFormData } from "../types/driverSearch.types";
import { Location } from "@/shared/types/ride.types";

import LocationPreview from "./LocationPreview";

interface FutureRideSearchFormProps {
  onSubmit: (formData: TripFormData) => void;
  onChange?: (formData: TripFormData) => void;
  isLoading?: boolean;
  onOpenLocationSearch: (type: "pickup" | "drop") => void;
  externalPickup: Location | null;
  externalDrop: Location | null;
  onClearLocation: (type: "pickup" | "drop") => void;
}

const FutureRideSearchForm: React.FC<FutureRideSearchFormProps> = ({
  onSubmit,
  onChange,
  isLoading = false,
  onOpenLocationSearch,
  externalPickup,
  externalDrop,
  onClearLocation,
}) => {
  const [formData, setFormData] = useState({
    tripType: "oneway" as "oneway" | "roundtrip",
    rideStartDate: "",
    rideStartTime: "",
    rideEndDate: "",
    rideEndTime: "",
    searchRadiusKm: 25,
    gearType: "Manual",
    bodyType: "Sedan",
    timeRequired: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isManualEnd, setIsManualEnd] = useState<boolean>(false);

  const lastEmitted = useRef<string>("");

  const formatDate = (d: Date): string => d.toISOString().slice(0, 10);

  const formatTime = (d: Date): string => d.toTimeString().slice(0, 5);

  const getFullData = (): TripFormData => ({
    ...formData,
    pickupLocation: externalPickup,
    dropLocation: externalDrop,
  });

  useEffect(() => {
    const now = new Date();

    now.setHours(now.getHours() + 6);

    setFormData((prev) => ({
      ...prev,
      rideStartDate: now.toISOString().slice(0, 10),
      rideStartTime: now.toTimeString().slice(0, 5),
    }));
  }, []);

  useEffect(() => {
    if (isManualEnd || !formData.rideStartDate || !formData.rideStartTime) {
      return;
    }

    const startISO = `${formData.rideStartDate}T${formData.rideStartTime}:00`;

    const startDate = new Date(startISO);

    if (Number.isNaN(startDate.getTime())) return;

    const durationMs = formData.timeRequired * 60 * 60 * 1000;

    const endDate = new Date(startDate.getTime() + durationMs);

    setFormData((prev) => ({
      ...prev,
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
    const currentData = getFullData();

    const dataString = JSON.stringify(currentData);

    if (lastEmitted.current !== dataString) {
      lastEmitted.current = dataString;

      onChange?.(currentData);
    }
  }, [formData, externalPickup, externalDrop, onChange]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!externalPickup) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (formData.tripType === "oneway" && !externalDrop) {
      newErrors.dropLocation = "Drop location is required";
    }

    if (!formData.rideStartDate) {
      newErrors.rideStartDate = "Required";
    }

    if (!formData.rideStartTime) {
      newErrors.rideStartTime = "Required";
    }

    const pickupDate = new Date(
      `${formData.rideStartDate}T${formData.rideStartTime}:00`,
    );

    const minimumDate = new Date(Date.now() + 6 * 60 * 60 * 1000);

    if (pickupDate < minimumDate) {
      newErrors.rideStartTime =
        "Future rides must be booked at least 6 hours in advance";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validate()) {
      onSubmit(getFullData());
    }
  };

  const handleToggleManualEnd = (checked: boolean): void => {
    setIsManualEnd(checked);

    if (!checked) return;

    if (!formData.rideEndDate || !formData.rideEndTime) {
      const startISO = `${formData.rideStartDate}T${formData.rideStartTime}:00`;

      const startDate = new Date(startISO);

      if (!Number.isNaN(startDate.getTime())) {
        const durationMs = formData.timeRequired * 60 * 60 * 1000;

        const endDate = new Date(startDate.getTime() + durationMs);

        setFormData((prev) => ({
          ...prev,
          rideEndDate: formatDate(endDate),
          rideEndTime: formatTime(endDate),
        }));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 ring-1 ring-gray-100">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <FaCar className="text-gray-700" />
          Schedule Future Ride
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
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tripType: type,
                  }))
                }
                className={`text-sm px-3 py-1 rounded-md transition ${
                  formData.tripType === type
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-700"
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

        {/* Start Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              Start Date
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
              <FaClock className="text-gray-500" />
              Start Time
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
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />

            {errors.rideStartTime && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.rideStartTime}
              </p>
            )}
          </div>
        </div>

        {/* Timing */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Timing
          </label>

          <div className="grid grid-cols-4 gap-3 items-end">
            {/* Duration */}
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">
                Required Time
              </label>

              <select
                value={formData.timeRequired}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeRequired: Number(e.target.value),
                  }))
                }
                disabled={isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 bg-white disabled:opacity-60"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h} {h === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>

            {/* Manual Toggle */}
            <div className="flex items-center gap-2">
              <input
                id="manual-end"
                type="checkbox"
                checked={isManualEnd}
                onChange={(e) => handleToggleManualEnd(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />

              <label htmlFor="manual-end" className="text-xs text-gray-600">
                Manual End
              </label>
            </div>

            {/* End Date */}
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">
                End Date
              </label>

              <input
                type="date"
                value={formData.rideEndDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rideEndDate: e.target.value,
                  }))
                }
                disabled={!isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 disabled:opacity-60"
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rideEndTime: e.target.value,
                  }))
                }
                disabled={!isManualEnd}
                className="w-full text-sm px-2 py-2 rounded-md border border-gray-200 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Search Radius:
            <span className="ml-1 font-medium text-gray-800">
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
              setFormData((prev) => ({
                ...prev,
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

        {/* Gear & Body */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCog className="text-gray-500" />
              Gear Type
            </label>

            <select
              value={formData.gearType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gearType: e.target.value,
                }))
              }
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200"
            >
              <option value="Manual">Manual</option>

              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <FaCar className="text-gray-500" />
              Body Type
            </label>

            <select
              value={formData.bodyType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bodyType: e.target.value,
                }))
              }
              className="w-full text-sm px-2 py-2 rounded-md border border-gray-200"
            >
              <option value="Sedan">Sedan</option>

              <option value="SUV">SUV</option>

              <option value="Hatchback">Hatchback</option>

              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isLoading
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : "bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 active:scale-[0.97]"
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
              Scheduling...
            </>
          ) : (
            <>
              <GiSteeringWheel />
              Schedule Ride
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FutureRideSearchForm;
