import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { FaSync, FaClock } from "react-icons/fa";

interface RideRequestsHeaderProps {
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const RideRequestsHeader: React.FC<RideRequestsHeaderProps> = ({
  total,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ride Requests
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="info" className="text-sm font-semibold">
              {total} {total === 1 ? "Request" : "Requests"}
            </Badge>
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`
    inline-flex items-center justify-center
    px-4 py-2 rounded-md border
    font-semibold text-sm
    transition-colors duration-200
    border-slate-300 text-slate-700
    hover:bg-slate-100
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
        >
          {isRefreshing ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
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
    </div>
  );
};
