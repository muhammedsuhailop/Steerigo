import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { FaInbox, FaSync } from "react-icons/fa";
import type { RideRequestsEmptyStateProps } from "../types/rideRequests.types";

export const RideRequestsEmptyState: React.FC<RideRequestsEmptyStateProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FaInbox className="text-gray-400 text-5xl" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No Pending Requests
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        You don't have any pending ride requests at the moment. New requests
        will appear here when riders send them.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`
    inline-flex items-center justify-center
    px-4 py-2 rounded-md
    bg-gray-600 text-white
    font-semibold text-sm
    transition-colors duration-200
    hover:bg-gray-700
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `}
      >
        {isRefreshing ? (
          <>
            <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <FaSync className="mr-2" />
            Refresh
          </>
        )}
      </button>
    </div>
  );
};
