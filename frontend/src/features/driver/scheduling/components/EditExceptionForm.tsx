import React, { useState } from "react";
import { FaTimes, FaSave, FaLock, FaInfoCircle } from "react-icons/fa";
import type {
  Exception,
  ExceptionUpdateFormData,
} from "../types/scheduling.types";

const pad = (n: number): string => String(n).padStart(2, "0");

const utcToLocal = (utcIso: string): string => {
  const date = new Date(utcIso);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const localToUtcIso = (local: string): string => {
  return new Date(local).toISOString();
};

const toDateOnly = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

interface EditExceptionFormProps {
  exception: Exception;
  onSubmit: (data: ExceptionUpdateFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface FormErrors {
  reason?: string;
  endTime?: string;
}

const EditExceptionForm: React.FC<EditExceptionFormProps> = ({
  exception,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    type: exception.type,
    reason: exception.reason,
    startTimeLocal: utcToLocal(exception.startTime),
    endTimeLocal: utcToLocal(exception.endTime),
    leaveDate: toDateOnly(new Date(exception.startTime)),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    const now = new Date();
    const start = new Date(formData.startTimeLocal);
    const end = new Date(formData.endTimeLocal);

    if (!formData.reason.trim()) e.reason = "Please provide a reason";
    if (isNaN(start.getTime())) return false;
    if (isNaN(end.getTime())) e.endTime = "Invalid end time";

    if (!e.endTime) {
      if (end < now) e.endTime = "End time cannot be in the past";
      if (end <= start) e.endTime = "End time must be after start time";
      if ((end.getTime() - start.getTime()) / 60000 < 30) {
        e.endTime = "Minimum duration is 30 minutes";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        reason: formData.reason,
        endTime: localToUtcIso(formData.endTimeLocal),
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update exception",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Edit Time Off</h3>
          <p className="text-[11px] text-slate-500">
            Adjust your time off details
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Error Notification */}
        {submitError && (
          <div className="flex items-center gap-2 text-xs bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100 animate-in fade-in zoom-in-95">
            <FaInfoCircle />
            {submitError}
          </div>
        )}

        {/* Read-only Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <FaLock className="text-[9px]" /> Type
            </label>
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 cursor-not-allowed">
              {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <FaLock className="text-[9px]" /> Started
            </label>
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 cursor-not-allowed">
              {new Date(formData.startTimeLocal).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Editable Reason */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Reason / Description
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            disabled={disabled}
            placeholder="Why is this exception needed?"
            className={`w-full rounded-xl border ${errors.reason ? "border-rose-300 ring-rose-50" : "border-slate-200 ring-indigo-50"} px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:bg-slate-50 disabled:text-slate-400 resize-none`}
            rows={2}
          />
          {errors.reason && (
            <p className="text-[10px] font-medium text-rose-600 flex items-center gap-1">
              <FaInfoCircle size={10} /> {errors.reason}
            </p>
          )}
        </div>

        {/* Editable End Time */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Revised End Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={formData.endTimeLocal}
              onChange={(e) =>
                setFormData((p) => ({ ...p, endTimeLocal: e.target.value }))
              }
              disabled={disabled}
              className={`w-full rounded-xl border ${errors.endTime ? "border-rose-300 ring-rose-50" : "border-slate-200 ring-indigo-50"} px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:bg-slate-50 disabled:text-slate-400`}
            />
          </div>
          {errors.endTime && (
            <p className="text-[10px] font-medium text-rose-600 flex items-center gap-1">
              <FaInfoCircle size={10} /> {errors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Discard
          </button>
        )}
        <button
          type="submit"
          disabled={disabled}
          className="flex-[2] bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:text-slate-500"
        >
          {disabled ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FaSave size={12} />
          )}
          {disabled ? "Saving changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditExceptionForm;
