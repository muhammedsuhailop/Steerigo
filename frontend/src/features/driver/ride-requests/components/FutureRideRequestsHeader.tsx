import React from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { FaSync } from "react-icons/fa";

interface FutureRideRequestsHeaderProps {
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const FutureRideRequestsHeader: React.FC<
  FutureRideRequestsHeaderProps
> = ({ total, onRefresh, isRefreshing }) => {
  return (
    <div className="flex items-center justify-between h-[52px] mb-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 bg-gray-500 rounded-full" />
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Scheduled Requests
        </h2>
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1 rounded-lg"
        >
          {total} {total === 1 ? "Upcoming" : "Upcoming"}
        </Badge>
      </div>

      {/* Action Section */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-600 transition-all hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600 active:scale-95 disabled:opacity-50"
      >
        <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
        <span>{isRefreshing ? "Syncing" : "Refresh"}</span>
      </button>
    </div>
  );
};
