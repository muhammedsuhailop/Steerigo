import React, { useEffect, useState } from "react";
import type { Location } from "../types/scheduling.types";

interface DayOption {
  value: number;
  label: string;
}

interface ScheduleFormData {
  daysOfWeek: number[];
  timeSlots: Array<{
    startTime: number;
    endTime: number;
  }>;
  validityStartDate: string;
  validityEndDate: string;
  notes: string;
  currentLocation: Location;
}

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  selectedLocation: Location | null;
  isLoading?: boolean;
  defaultAvailableFrom?: Date;
  defaultAvailableTill?: Date;
  defaultLocation?: Location;
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const daysOfWeek: DayOption[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const toDateTimeLocal = (date: Date | null): string => {
  if (!date) return "";

  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());

  return local.toISOString().slice(0, 16);
};

const parseDateTimeLocal = (value: string): Date | null => {
  if (!value) return null;

  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const localDate = new Date(year, month - 1, day, hour, minute);

  return localDate;
};

const timeStringToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const syncDaysWithDateRange = (
  from: Date | null,
  to: Date | null,
  prevDays: number[],
  forceAuto = false
): number[] => {
  if (!from || !to) return prevDays;

  const validDays = getWeekdaysInRange(from, to);

  if (forceAuto) return validDays;

  return prevDays.filter((d) => validDays.includes(d));
};

const getWeekdaysInRange = (from: Date, to: Date): number[] => {
  const days = new Set<number>();

  const current = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
  );

  const end = new Date(
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate())
  );

  while (current <= end) {
    days.add(current.getUTCDay());
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return Array.from(days);
};

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onSubmit,
  selectedLocation,
  isLoading = false,
  defaultAvailableFrom,
  defaultAvailableTill,
  defaultLocation,
}) => {
  const [isDaysManuallyEdited, setIsDaysManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    validityStartDate: defaultAvailableFrom || null,
    validityEndDate: defaultAvailableTill || null,
    startTime: "09:00",
    endTime: "18:00",
    daysOfWeek: ALL_DAYS,
    notes: "",
    location: defaultLocation || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!defaultAvailableFrom || !defaultAvailableTill) return;

    const from = new Date(defaultAvailableFrom);
    const till = new Date(defaultAvailableTill);
    const validWeekdays = getWeekdaysInRange(from, till);

    setFormData((prev) => ({
      ...prev,
      validityStartDate: from,
      validityEndDate: till,
      startTime: `${pad(from.getUTCHours())}:${pad(from.getUTCMinutes())}`,
      endTime: `${pad(till.getUTCHours())}:${pad(till.getUTCMinutes())}`,
      daysOfWeek: isDaysManuallyEdited
        ? prev.daysOfWeek.filter((d) => validWeekdays.includes(d))
        : validWeekdays,
      location: defaultLocation || null,
    }));

    setIsDaysManuallyEdited(false);
  }, [defaultAvailableFrom, defaultAvailableTill, defaultLocation]);

  useEffect(() => {
    setFormData((p) => ({ ...p, location: selectedLocation || p.location }));
  }, [selectedLocation]);

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.validityStartDate)
      e.validityStartDate = "Start date is required";
    if (!formData.validityEndDate) e.validityEndDate = "End date is required";

    if (
      formData.validityStartDate &&
      formData.validityEndDate &&
      formData.validityStartDate > formData.validityEndDate
    ) {
      e.validityEndDate = "End date must be after start date";
    }

    if (!formData.startTime) e.startTime = "Start time is required";
    if (!formData.endTime) e.endTime = "End time is required";

    if (
      formData.startTime &&
      formData.endTime &&
      formData.validityStartDate &&
      formData.validityEndDate
    ) {
      const s = timeStringToMinutes(formData.startTime);
      const en = timeStringToMinutes(formData.endTime);

      const isSameDay =
        formData.validityStartDate.toDateString() ===
        formData.validityEndDate.toDateString();

      if (isSameDay && s >= en) {
        e.endTime = "End time must be after start time for the same day";
      }
    }

    if (!formData.location) e.location = "Please select a location";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formData.location) return;

    onSubmit({
      daysOfWeek: formData.daysOfWeek,
      timeSlots: [
        {
          startTime: timeStringToMinutes(formData.startTime),
          endTime: timeStringToMinutes(formData.endTime),
        },
      ],
      validityStartDate: formData.validityStartDate!.toISOString(),
      validityEndDate: formData.validityEndDate!.toISOString(),
      notes: formData.notes,
      currentLocation: formData.location,
    });
  };

  const toggleDay = (day: number) => {
    setIsDaysManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Schedule Details
          </h2>

          {/* Validity */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              Validity Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-1">
                <label
                  htmlFor="validity-start"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date & Time
                </label>
                <input
                  id="validity-start"
                  type="datetime-local"
                  value={toDateTimeLocal(formData.validityStartDate)}
                  onChange={(e) => {
                    const newStart = parseDateTimeLocal(e.target.value);

                    setFormData((prev) => ({
                      ...prev,
                      validityStartDate: newStart,
                      daysOfWeek: syncDaysWithDateRange(
                        newStart,
                        prev.validityEndDate,
                        prev.daysOfWeek,
                        !isDaysManuallyEdited
                      ),
                    }));
                  }}
                  className="input w-full"
                />
              </div>
              {errors.validityStartDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.validityStartDate}
                </p>
              )}

              {/* End Date */}
              <div className="space-y-1">
                <label
                  htmlFor="validity-end"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date & Time
                </label>
                <input
                  id="validity-end"
                  type="datetime-local"
                  value={toDateTimeLocal(formData.validityEndDate)}
                  onChange={(e) => {
                    const newEnd = parseDateTimeLocal(e.target.value);

                    setFormData((prev) => ({
                      ...prev,
                      validityEndDate: newEnd,
                      daysOfWeek: syncDaysWithDateRange(
                        prev.validityStartDate,
                        newEnd,
                        prev.daysOfWeek,
                        !isDaysManuallyEdited
                      ),
                    }));
                  }}
                  className="input w-full"
                />
              </div>
              {errors.validityEndDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.validityEndDate}
                </p>
              )}
            </div>
          </section>

          {/* Days */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Repeat On</h3>
            <p className="text-sm text-gray-500">
              Select the days this schedule should repeat
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.daysOfWeek.includes(day.value)}
                    onChange={() => toggleDay(day.value)}
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-1">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((p) => ({ ...p, notes: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes..."
            />
          </section>

          {/* Location */}
          <section className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Location</h3>
            <div className="border border-dashed rounded-xl p-4 bg-gray-50">
              {formData.location ? (
                <p className="text-sm text-gray-700">
                  {formData.location.address}
                </p>
              ) : (
                <p className="italic text-sm text-gray-500">
                  No location selected
                </p>
              )}
            </div>
          </section>
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {isLoading ? "Updating..." : "Update Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
