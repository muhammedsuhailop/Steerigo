import React, { useEffect, useState } from "react";
import { FaTimes, FaClock, FaPause } from "react-icons/fa";
import type {
  ExceptionFormData,
  ExceptionType,
} from "../types/scheduling.types";

const pad = (n: number) => String(n).padStart(2, "0");

const nowLocal = () => {
  const d = new Date();

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const localToUtcIso = (local: string) => {
  return new Date(local).toISOString();
};

const toDateOnly = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const getTodayDateOnly = (): string => {
  const d = new Date();

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
};

const getNowLocalDateTime = (): string => {
  const d = new Date();

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface ExceptionFormProps {
  onSubmit: (data: ExceptionFormData) => Promise<unknown>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const EXCEPTION_TYPES: {
  value: ExceptionType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "break", label: "Break / Rest", icon: <FaPause /> },
  { value: "leave", label: "Leave", icon: <FaTimes /> },
  { value: "other", label: "Other", icon: <FaClock /> },
];

const ExceptionForm: React.FC<ExceptionFormProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    type: "break" as ExceptionType,
    reason: "",
    startTimeLocal: nowLocal(),
    endTimeLocal: nowLocal(),
    leaveDate: toDateOnly(new Date()),
  });

  useEffect(() => {
    const now = new Date();

    setFormData((prev) => {
      const updated = { ...prev };

      if (prev.type === "leave") {
        if (new Date(prev.leaveDate) < now) {
          updated.leaveDate = getTodayDateOnly();
        }
      } else {
        if (new Date(prev.startTimeLocal) < now) {
          updated.startTimeLocal = getNowLocalDateTime();
        }

        if (new Date(prev.endTimeLocal) < now) {
          updated.endTimeLocal = getNowLocalDateTime();
        }
      }

      return updated;
    });
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const e: Record<string, string> = {};

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.reason.trim()) {
      e.reason = "Reason is required";
    }

    if (formData.type === "leave") {
      if (!formData.leaveDate) {
        e.leaveDate = "Date is required";
      } else {
        const leaveDate = new Date(formData.leaveDate);
        leaveDate.setHours(0, 0, 0, 0);

        if (leaveDate < today) {
          e.leaveDate = "Leave date cannot be in the past";
        }
      }
    } else {
      const start = new Date(formData.startTimeLocal);
      const end = new Date(formData.endTimeLocal);

      if (isNaN(start.getTime())) {
        e.startTime = "Invalid start time";
      }

      if (isNaN(end.getTime())) {
        e.endTime = "Invalid end time";
      }

      if (!e.startTime && !e.endTime) {
        if (start < now) {
          e.startTime = "Start time cannot be in the past";
        }

        if (end < now) {
          e.endTime = "End time cannot be in the past";
        }

        if (end <= start) {
          e.endTime = "End time must be after start time";
        }

        const minutes = (end.getTime() - start.getTime()) / 60000;

        if (minutes < 30) {
          e.endTime = "Minimum duration is 30 minutes";
        }
      }
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let startIso = "";
      let endIso = "";

      if (formData.type === "leave") {
        const date = new Date(formData.leaveDate);

        startIso = startOfDay(date).toISOString();
        endIso = endOfDay(date).toISOString();
      } else {
        startIso = localToUtcIso(formData.startTimeLocal);
        endIso = localToUtcIso(formData.endTimeLocal);
      }

      await onSubmit({
        type: formData.type,
        reason: formData.reason,
        startTime: startIso,
        endTime: endIso,
      });

      setFormData({
        type: "break",
        reason: "",
        startTimeLocal: nowLocal(),
        endTimeLocal: nowLocal(),
        leaveDate: toDateOnly(new Date()),
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save exception",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Schedule Time Off
        </h3>

        {onCancel && (
          <button
            onClick={onCancel}
            disabled={disabled}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Error */}
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Time Off type
          </p>

          <div className="grid grid-cols-3 gap-3">
            {EXCEPTION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                disabled={disabled}
                onClick={() => setFormData((p) => ({ ...p, type: t.value }))}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium
                ${
                  formData.type === t.value
                    ? "border-amber-400 bg-amber-50 text-amber-800 shadow-sm shadow-amber-100"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>

          <input
            type="text"
            value={formData.reason}
            disabled={disabled}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
          )}
        </div>

        {/* Leave Date */}
        {formData.type === "leave" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Date
            </label>

            <input
              type="date"
              min={getTodayDateOnly()}
              value={formData.leaveDate}
              disabled={disabled}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  leaveDate: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />

            {errors.leaveDate && (
              <p className="mt-1 text-xs text-red-600">{errors.leaveDate}</p>
            )}
          </div>
        )}

        {/* DateTime (Break / Other) */}
        {formData.type !== "leave" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start time
              </label>

              <input
                type="datetime-local"
                min={getNowLocalDateTime()}
                value={formData.startTimeLocal}
                disabled={disabled}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    startTimeLocal: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />

              {errors.startTime && (
                <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
              )}
            </div>

            {/* End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End time
              </label>

              <input
                type="datetime-local"
                min={formData.startTimeLocal || getNowLocalDateTime()}
                value={formData.endTimeLocal}
                disabled={disabled}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    endTimeLocal: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />

              {errors.endTime && (
                <p className="mt-1 text-xs text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 py-2.5 text-sm font-semibold text-white hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-sm shadow-slate-300/50"
        >
          {disabled ? "Saving..." : "Schedule Time Off"}
        </button>
      </form>
    </div>
  );
};

export default ExceptionForm;
