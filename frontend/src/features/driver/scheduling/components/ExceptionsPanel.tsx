import React, { useState } from "react";
import { FaExclamationTriangle, FaClock, FaPlus } from "react-icons/fa";
import { Exception, ExceptionFormData } from "../types/scheduling.types";
import ExceptionForm from "./ExceptionForm";
import { useCreateExceptionMutation } from "../services/schedulingApi";

interface Props {
  exceptions: Exception[];
}

function formatLocalDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const ExceptionsPanel: React.FC<Props> = ({ exceptions }) => {
  const [showForm, setShowForm] = useState(false);
  const [createException, { isLoading }] = useCreateExceptionMutation();

  const handleCreate = async (data: ExceptionFormData) => {
    await createException({ ...data }).unwrap();
    setShowForm(false);
  };

  if (!exceptions.length && !showForm) return null;

  return (
    <div className="mt-6 pt-5 border-t border-gray-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-amber-700">
        <div className="flex items-center gap-2">
          <FaExclamationTriangle />
          <h4 className="text-sm font-semibold">Active Exceptions</h4>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-xs bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition"
          >
            <FaPlus size={12} />
            Add Exception
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <ExceptionForm
          onSubmit={handleCreate}
          isLoading={isLoading}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Exceptions List */}
      <div className="space-y-3">
        {exceptions.map((ex, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="font-medium capitalize">{ex.type}</p>
                <p className="text-xs text-amber-700 mt-1">{ex.reason}</p>
              </div>

              {ex.isRecurring && (
                <span className="text-xs bg-amber-100 px-2 py-0.5 rounded-full">
                  Recurring ({ex.recurringPattern})
                </span>
              )}
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs">
              <FaClock className="mt-0.5" />
              <div>
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {formatLocalDateTime(ex.startTime)}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {formatLocalDateTime(ex.endTime)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExceptionsPanel;
