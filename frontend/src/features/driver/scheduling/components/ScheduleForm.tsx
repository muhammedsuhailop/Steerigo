import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCheckCircle,
} from "react-icons/fa";
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
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const toDateOnly = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateOnly = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const timeStringToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const getWeekdaysInRange = (from: Date, to: Date): number[] => {
  const days = new Set<number>();
  const current = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );
  const end = new Date(
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()),
  );
  while (current <= end) {
    days.add(current.getUTCDay());
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return Array.from(days);
};

const syncDaysWithDateRange = (
  from: Date | null,
  to: Date | null,
  prevDays: number[],
  forceAuto = false,
): number[] => {
  if (!from || !to) return prevDays;
  const validDays = getWeekdaysInRange(from, to);
  if (forceAuto) return validDays;
  return prevDays.filter((d) => validDays.includes(d));
};

const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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
    if (!formData.startTime) e.startTime = "Required";
    if (!formData.endTime) e.endTime = "Required";
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

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-gray-500 focus:ring-4 focus:ring-gray-50";

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-slate-900 px-8 py-6">
            <h2 className="text-xl font-bold text-white">
              Set Your Availability
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Set your availability and location parameters
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Validity Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt size={14} />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Availability Period
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 ml-1">
                    START DATE
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={toDateOnly(formData.validityStartDate)}
                    onChange={(e) => {
                      const date = parseDateOnly(e.target.value);
                      const newStart = date ? startOfDay(date) : null;
                      setFormData((p) => ({
                        ...p,
                        validityStartDate: newStart,
                        daysOfWeek: syncDaysWithDateRange(
                          newStart,
                          p.validityEndDate,
                          p.daysOfWeek,
                          !isDaysManuallyEdited,
                        ),
                      }));
                    }}
                    className={`${inputClasses} ${errors.validityStartDate ? "border-rose-300" : ""}`}
                  />
                  {errors.validityStartDate && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {errors.validityStartDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 ml-1">
                    END DATE
                  </label>
                  <input
                    type="date"
                    min={
                      toDateOnly(formData.validityStartDate) ||
                      getTodayDateString()
                    }
                    value={toDateOnly(formData.validityEndDate)}
                    onChange={(e) => {
                      const date = parseDateOnly(e.target.value);
                      const newEnd = date ? endOfDay(date) : null;
                      setFormData((p) => ({
                        ...p,
                        validityEndDate: newEnd,
                        daysOfWeek: syncDaysWithDateRange(
                          p.validityStartDate,
                          newEnd,
                          p.daysOfWeek,
                          !isDaysManuallyEdited,
                        ),
                      }));
                    }}
                    className={`${inputClasses} ${errors.validityEndDate ? "border-rose-300" : ""}`}
                  />
                  {errors.validityEndDate && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {errors.validityEndDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock size={14} />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Daily Hours
                </h3>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block ml-1">
                    FROM
                  </span>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, startTime: e.target.value }))
                    }
                    className={inputClasses}
                  />
                </div>
                <div className="h-8 w-px bg-slate-200 mt-4 hidden md:block" />
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block ml-1">
                    TO
                  </span>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, endTime: e.target.value }))
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Repeat Days */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-800 block">
                Repeat On
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isActive = formData.daysOfWeek.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`flex-1 min-w-[60px] py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                        isActive
                          ? "bg-gray-600 border-gray-600 text-white shadow-lg shadow-gray-100"
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaStickyNote size={14} />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Notes
                  </h3>
                </div>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, notes: e.target.value }))
                  }
                  className={`${inputClasses} min-h-[100px] resize-none`}
                  placeholder="Specific instructions for this schedule..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt size={14} />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Location
                  </h3>
                </div>
                <div
                  className={`p-4 rounded-2xl border-2 border-dashed transition-colors ${
                    formData.location
                      ? "bg-gray-50/30 border-gray-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {formData.location ? (
                    <div className="flex gap-2">
                      <FaCheckCircle className="text-gray-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {formData.location.address}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No location selected. Please select one from the map.
                    </p>
                  )}
                </div>
                {errors.location && (
                  <p className="text-[10px] text-rose-500 font-medium">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-slate-200 hover:bg-slate-900 active:scale-[0.99] transition-all disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Update Schedule Settings"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
