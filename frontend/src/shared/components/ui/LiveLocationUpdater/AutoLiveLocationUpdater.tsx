import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  selectIsAutoSyncEnabled,
  toggleAutoSync,
} from "@/features/driver/shared/store/driverSlice";
import React from "react";
import { FaMapMarkerAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

const AutoLiveLocationUpdater: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAutoSyncEnabled = useAppSelector(selectIsAutoSyncEnabled);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FaMapMarkerAlt className="text-indigo-500" />
          Auto-Live Location
        </h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Automatically updates your live coordinates every 5 minutes while
          active.
        </p>
      </div>

      <div className="flex items-center justify-start sm:justify-end mt-auto">
        <button
          onClick={() => dispatch(toggleAutoSync())}
          className={`w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] ${
            isAutoSyncEnabled
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          {isAutoSyncEnabled ? (
            <>
              <FaToggleOn className="text-xl text-indigo-600" />
              Auto-Sync: ON
            </>
          ) : (
            <>
              <FaToggleOff className="text-xl text-gray-400" />
              Auto-Sync: OFF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AutoLiveLocationUpdater;
