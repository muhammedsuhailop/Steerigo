import React, { useEffect, useState } from "react";
import type { ScheduleFormData, Location } from "../types/scheduling.types";

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  selectedLocation: Location | null;
  isLoading?: boolean;
  defaultAvailableFrom?: Date;
  defaultAvailableTill?: Date;
  defaultLocation?: Location;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onSubmit,
  selectedLocation,
  isLoading = false,
  defaultAvailableFrom,
  defaultAvailableTill,
  defaultLocation,
}) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  // convert Date -> "YYYY-MM-DDTHH:MM" in LOCAL time (for datetime-local)
  const toDateTimeLocal = (date: Date | null) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${y}-${m}-${d}T${hh}:${mm}`;
  };

  // parse "YYYY-MM-DDTHH:MM" into a Date in LOCAL time
  const parseDateTimeLocal = (value: string) => {
    if (!value) return null;
    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return null;
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);
    return new Date(y, m - 1, d, hh ?? 0, mm ?? 0, 0, 0);
  };

  // initial form data
  const [formData, setFormData] = useState<{
    availableFrom: Date | null;
    availableTill: Date | null;
    location: Location | null;
  }>({
    availableFrom: defaultAvailableFrom || null,
    availableTill: defaultAvailableTill || null,
    location: defaultLocation || null,
  });

  const [errors, setErrors] = useState<{
    availableFrom?: string;
    availableTill?: string;
    location?: string;
  }>({});

  // sync defaults when parent props change
  useEffect(() => {
    setFormData({
      availableFrom: defaultAvailableFrom || null,
      availableTill: defaultAvailableTill || null,
      location: defaultLocation || null,
    });
    setErrors({});
  }, [defaultAvailableFrom, defaultAvailableTill, defaultLocation]);

  // Update form data when selected location changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation || prev.location,
    }));
  }, [selectedLocation]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.availableFrom) {
      newErrors.availableFrom = "Start time is required";
    }

    if (!formData.availableTill) {
      newErrors.availableTill = "End time is required";
    }

    if (formData.availableFrom && formData.availableTill) {
      if (formData.availableFrom >= formData.availableTill) {
        newErrors.availableTill = "End time must be after start time";
      }
    }

    const now = new Date();
    if (formData.availableFrom && formData.availableFrom < now) {
      newErrors.availableFrom = "Start time cannot be in the past";
    }

    if (!formData.location) {
      newErrors.location = "Please select a location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as ScheduleFormData);
    }
  };

  const handleDateTimeChange = (
    field: "availableFrom" | "availableTill",
    value: string
  ) => {
    const date = parseDateTimeLocal(value);
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return toDateTimeLocal(now);
  };

  const getMinEndDateTime = () => {
    if (formData.availableFrom) {
      const minEnd = new Date(formData.availableFrom);
      minEnd.setMinutes(minEnd.getMinutes() + 30);
      return toDateTimeLocal(minEnd);
    }
    return getMinDateTime();
  };

  const dateToInputFormat = (date: Date | null) => toDateTimeLocal(date);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-5">
        Schedule Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Available From */}
        <div>
          <label
            htmlFor="availableFrom"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Available From
          </label>
          <input
            id="availableFrom"
            type="datetime-local"
            value={dateToInputFormat(formData.availableFrom)}
            onChange={(e) =>
              handleDateTimeChange("availableFrom", e.target.value)
            }
            min={getMinDateTime()}
            className={`w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition ${
              errors.availableFrom
                ? "border-red-300 text-red-700 focus:ring-red-400 focus:border-red-400"
                : "border-gray-200 text-slate-700"
            }`}
          />
          {errors.availableFrom && (
            <p className="text-red-600 text-sm mt-1">{errors.availableFrom}</p>
          )}
        </div>

        {/* Available Till */}
        <div>
          <label
            htmlFor="availableTill"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Available Till
          </label>
          <input
            id="availableTill"
            type="datetime-local"
            value={dateToInputFormat(formData.availableTill)}
            onChange={(e) =>
              handleDateTimeChange("availableTill", e.target.value)
            }
            min={getMinEndDateTime()}
            className={`w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition ${
              errors.availableTill
                ? "border-red-300 text-red-700 focus:ring-red-400 focus:border-red-400"
                : "border-gray-200 text-slate-700"
            }`}
          />
          {errors.availableTill && (
            <p className="text-red-600 text-sm mt-1">{errors.availableTill}</p>
          )}
        </div>

        {/* Location Info */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Selected Location:
          </label>
          {formData.location ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-emerald-900 font-medium">
                {formData.location.address}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-900">
                No location selected. Please select a location on the map.
              </p>
            </div>
          )}
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              Updating Schedule...
            </>
          ) : (
            "Update Schedule"
          )}
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;
