import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaClock, FaPause } from "react-icons/fa";
import type {
  ExceptionFormData,
  ExceptionType,
  RecurringPattern,
} from "../types/scheduling.types";

const pad = (n: number) => String(n).padStart(2, "0");

const nowLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const localToUtcIso = (local: string) => {
  return new Date(local).toISOString();
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

const RECURRING_PATTERNS: { value: RecurringPattern; label: string }[] = [
  { value: "daily", label: "Every Day" },
  { value: "weekly", label: "Every Week" },
  { value: "monthly", label: "Every Month" },
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
    isRecurring: false,
    recurringPattern: "daily" as RecurringPattern,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!formData.isRecurring) {
      setFormData((p) => ({ ...p, recurringPattern: undefined as any }));
    }
  }, [formData.isRecurring]);

  const validateForm = () => {
    const e: Record<string, string> = {};
    const start = new Date(formData.startTimeLocal);
    const end = new Date(formData.endTimeLocal);
    const now = new Date();

    if (!formData.reason.trim()) {
      e.reason = "Reason is required";
    }

    if (start < now) {
      e.startTime = "Start time cannot be in the past";
    }

    if (end <= start) {
      e.endTime = "End time must be after start time";
    }

    const minutes = (end.getTime() - start.getTime()) / 60000;
    if (minutes < 30) {
      e.endTime = "Duration must be at least 30 minutes";
    }

    if (formData.isRecurring && !formData.recurringPattern) {
      e.recurringPattern = "Recurring pattern is required";
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
      await onSubmit({
        type: formData.type,
        reason: formData.reason,
        startTime: localToUtcIso(formData.startTimeLocal),
        endTime: localToUtcIso(formData.endTimeLocal),
        isRecurring: formData.isRecurring,
        recurringPattern: formData.isRecurring
          ? formData.recurringPattern
          : undefined,
      });

      setFormData({
        type: "break",
        reason: "",
        startTimeLocal: nowLocal(),
        endTimeLocal: nowLocal(),
        isRecurring: false,
        recurringPattern: "daily",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save exception"
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
        <h3 className="text-base font-semibold text-gray-900">Add Exception</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={disabled}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
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
        {/* Exception Type */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Exception type
          </p>
          <div className="grid grid-cols-3 gap-3">
            {EXCEPTION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                disabled={disabled}
                onClick={() => setFormData((p) => ({ ...p, type: t.value }))}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition
                ${
                  formData.type === t.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }
                disabled:opacity-50`}
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
            placeholder="Enter reason"
            value={formData.reason}
            disabled={disabled}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:bg-gray-100"
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
          )}
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start time
            </label>
            <input
              type="datetime-local"
              value={formData.startTimeLocal}
              disabled={disabled}
              onChange={(e) =>
                setFormData((p) => {
                  const start = new Date(e.target.value);
                  const end = new Date(p.endTimeLocal);
                  if (end <= start) {
                    end.setMinutes(start.getMinutes() + 30);
                  }
                  return {
                    ...p,
                    startTimeLocal: e.target.value,
                    endTimeLocal: `${end.getFullYear()}-${pad(
                      end.getMonth() + 1
                    )}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(
                      end.getMinutes()
                    )}`,
                  };
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:bg-gray-100"
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End time
            </label>
            <input
              type="datetime-local"
              value={formData.endTimeLocal}
              disabled={disabled}
              onChange={(e) =>
                setFormData((p) => ({ ...p, endTimeLocal: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:bg-gray-100"
            />
            {errors.endTime && (
              <p className="mt-1 text-xs text-red-600">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Recurring */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            disabled={disabled}
            onChange={(e) =>
              setFormData((p) => ({ ...p, isRecurring: e.target.checked }))
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            This exception occurs regularly
          </span>
        </div>

        {formData.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repeat pattern
            </label>
            <select
              value={formData.recurringPattern}
              disabled={disabled}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  recurringPattern: e.target.value as RecurringPattern,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:bg-gray-100"
            >
              {RECURRING_PATTERNS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.recurringPattern && (
              <p className="mt-1 text-xs text-red-600">
                {errors.recurringPattern}
              </p>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {disabled ? "Saving..." : "Add Exception"}
        </button>
      </form>
    </div>
  );
};

export default ExceptionForm;
