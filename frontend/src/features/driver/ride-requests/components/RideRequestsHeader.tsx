import React from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { FaSync } from "react-icons/fa";

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
    <div className="flex items-center justify-between h-[52px] mb-4">
      {/* Title Section with Vertical Bar */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 bg-emerald-500 rounded-full" />
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Quick Requests
        </h1>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-lg"
        >
          {total} {total === 1 ? "Request" : "Requests"}
        </Badge>
      </div>

      {/* Action Section */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50"
      >
        <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
        <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
      </button>
    </div>
  );
};
