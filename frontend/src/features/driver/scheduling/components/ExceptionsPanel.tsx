import React, { useState } from "react";
import {
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BsFillSignStopLightsFill } from "react-icons/bs";
import type {
  Exception,
  ExceptionFormData,
  ExceptionUpdateFormData,
} from "../types/scheduling.types";
import ExceptionForm from "./ExceptionForm";
import EditExceptionForm from "./EditExceptionForm";
import { Alert } from "@/shared/components/ui/Alert";
import {
  useCreateExceptionMutation,
  useUpdateExceptionMutation,
  useDeleteExceptionMutation,
} from "../services/schedulingApi";

interface Props {
  exceptions: Exception[];
  onShowAlert?: (message: string, type: "success" | "danger") => void;
}

interface FormState {
  type: "create" | "edit" | null;
  exceptionId?: string;
}

function formatLocalDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const ExceptionsPanel: React.FC<Props> = ({ exceptions, onShowAlert }) => {
  const [formState, setFormState] = useState<FormState>({ type: null });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [createException, { isLoading: isCreateLoading }] =
    useCreateExceptionMutation();
  const [updateException, { isLoading: isUpdateLoading }] =
    useUpdateExceptionMutation();
  const [deleteException, { isLoading: isDeleteLoading }] =
    useDeleteExceptionMutation();

  const handleCreate = async (data: ExceptionFormData): Promise<void> => {
    try {
      await createException({ ...data }).unwrap();
      setFormState({ type: null });
      if (onShowAlert) {
        onShowAlert("Time off scheduled successfully!", "success");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to schedule time off. Please try again.";
      if (onShowAlert) {
        onShowAlert(errorMessage, "danger");
      }
    }
  };

  const handleEdit = async (data: ExceptionUpdateFormData): Promise<void> => {
    if (!formState.exceptionId) {
      if (onShowAlert) {
        onShowAlert("Exception ID is required", "danger");
      }
      throw new Error("Exception ID required");
    }

    try {
      await updateException({ id: formState.exceptionId, data }).unwrap();
      setFormState({ type: null });
      if (onShowAlert) {
        onShowAlert("Time off updated successfully!", "success");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to update time off. Please try again.";
      if (onShowAlert) {
        onShowAlert(errorMessage, "danger");
      }
    }
  };

  const confirmDelete = async (id: string): Promise<void> => {
    try {
      await deleteException(id).unwrap();
      setDeleteConfirmId(null);
      if (onShowAlert) {
        onShowAlert("Time off deleted successfully!", "success");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to delete time off. Please try again.";
      if (onShowAlert) {
        onShowAlert(errorMessage, "danger");
      }
    }
  };

  const isGlobalLoading = isCreateLoading || isUpdateLoading || isDeleteLoading;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BsFillSignStopLightsFill className="text-amber-500" />
            Time Off & Breaks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {" "}
            Leaves and time off from your schedule{" "}
          </p>
        </div>

        {!formState.type && (
          <button
            onClick={() => setFormState({ type: "create" })}
            disabled={isGlobalLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-full shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            <FaPlus size={10} />
            Schedule Time Off
          </button>
        )}
      </div>

      {/* Create Form Area */}
      {formState.type === "create" && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 ring-4 ring-indigo-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <ExceptionForm
            onSubmit={handleCreate}
            isLoading={isCreateLoading}
            onCancel={() => setFormState({ type: null })}
          />
        </div>
      )}

      {/* Exceptions List */}
      <div className="space-y-3">
        {exceptions.length === 0 && !formState.type ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FaHistory className="mx-auto text-slate-300 mb-2 text-xl" />
            <p className="text-sm text-slate-400">No active Time off.</p>
          </div>
        ) : (
          exceptions.map((ex) => {
            const isEditing =
              formState.type === "edit" && formState.exceptionId === ex.id;
            const isDeleting = deleteConfirmId === ex.id;

            return (
              <div key={ex.id} className="group space-y-3">
                <div
                  className={`relative overflow-hidden transition-all duration-200 bg-white border ${
                    isEditing || isDeleting
                      ? "border-indigo-200 shadow-md"
                      : "border-slate-200 shadow-sm"
                  } rounded-xl p-4 hover:border-slate-300`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${ex.type === "leave" ? "bg-rose-400" : "bg-amber-400"}`}
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                            ex.type === "leave"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ex.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {ex.reason}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                          <FaCalendarAlt size={12} className="text-slate-400" />
                          <div className="text-[11px] leading-none">
                            <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">
                              Start
                            </span>
                            {formatLocalDateTime(ex.startTime)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                          <FaClock size={12} className="text-slate-400" />
                          <div className="text-[11px] leading-none">
                            <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">
                              End
                            </span>
                            {formatLocalDateTime(ex.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isDeleting && (
                      <div className="flex gap-1 ml-4 transition-opacity duration-200">
                        <button
                          onClick={() => {
                            setFormState({ type: "edit", exceptionId: ex.id });
                            setDeleteConfirmId(null);
                          }}
                          disabled={isGlobalLoading}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmId(ex.id);
                            setFormState({ type: null });
                          }}
                          disabled={isGlobalLoading}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Deletion Alert Integration */}
                  {isDeleting && (
                    <div className="mt-4 animate-in slide-in-from-right-4 duration-300">
                      <Alert
                        type="danger"
                        onClose={() => setDeleteConfirmId(null)}
                        className="border-rose-200 bg-rose-50"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-rose-800">
                            <FaExclamationTriangle className="shrink-0" />
                            <span className="text-xs font-bold">
                              Permanently delete this exception?
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmDelete(ex.id)}
                              disabled={isDeleteLoading}
                              className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-colors disabled:bg-rose-300"
                            >
                              {isDeleteLoading ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 text-[10px] font-bold rounded-lg hover:bg-rose-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Alert>
                    </div>
                  )}
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-inner animate-in zoom-in-95 duration-200">
                    <EditExceptionForm
                      exception={ex}
                      onSubmit={handleEdit}
                      isLoading={isUpdateLoading}
                      onCancel={() => setFormState({ type: null })}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExceptionsPanel;
