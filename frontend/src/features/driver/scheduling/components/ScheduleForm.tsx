import React, { useState, useEffect } from "react";
import type { ScheduleFormData, Location } from "../types/scheduling.types";

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  selectedLocation: Location | null;
  isLoading?: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onSubmit,
  selectedLocation,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    availableFrom: null,
    availableTill: null,
    location: null,
  });

  const [errors, setErrors] = useState<{
    availableFrom?: string;
    availableTill?: string;
    location?: string;
  }>({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation,
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
      const now = new Date();
      if (formData.availableFrom < now) {
        newErrors.availableFrom = "Start time cannot be in the past";
      }
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
      onSubmit(formData);
    }
  };

  const handleDateTimeChange = (
    field: "availableFrom" | "availableTill",
    value: string
  ) => {
    const date = value ? new Date(value) : null;
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
    return now.toISOString().slice(0, 16);
  };

  const getMinEndDateTime = () => {
    if (formData.availableFrom) {
      const minEnd = new Date(formData.availableFrom);
      minEnd.setMinutes(minEnd.getMinutes() + 30);
      return minEnd.toISOString().slice(0, 16);
    }
    return getMinDateTime();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/90 p-6 rounded-2xl shadow border border-gray-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
          Schedule Details
        </h3>
        <div className="space-y-5">
          {/* Available From */}
          <div>
            <label
              htmlFor="availableFrom"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Available From
            </label>
            <input
              type="datetime-local"
              id="availableFrom"
              value={formData.availableFrom?.toISOString().slice(0, 16) || ""}
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
              <p className="mt-1 text-xs text-red-500">
                {errors.availableFrom}
              </p>
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
              type="datetime-local"
              id="availableTill"
              value={formData.availableTill?.toISOString().slice(0, 16) || ""}
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
              <p className="mt-1 text-xs text-red-500">
                {errors.availableTill}
              </p>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-900 mb-1">
                  Selected Location:
                </p>
                {formData.location ? (
                  <p className="text-sm text-indigo-700 font-medium">
                    {formData.location.address}
                  </p>
                ) : (
                  <p className="text-sm text-indigo-500 italic">
                    No location selected. Please select a location on the map.
                  </p>
                )}
              </div>
            </div>
            {errors.location && (
              <p className="mt-2 text-xs text-red-500">{errors.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-xl text-base font-semibold transition-all active:scale-[0.98]
          ${
            isLoading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Updating Schedule...</span>
          </span>
        ) : (
          "Update Schedule"
        )}
      </button>
    </form>
  );
};

export default ScheduleForm;
