import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaHistory } from "react-icons/fa";
import { RideTimeline } from "@/shared/types/ride.types";
import { RideTimelineStatus } from "./RideTimelineStatus";

interface RideTimelineExpandableProps {
  timeline: RideTimeline;
}

const RideTimelineExpandable: React.FC<RideTimelineExpandableProps> = ({
  timeline,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gray-50 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors shadow-sm">
            <FaHistory size={14} />
          </div>

          <div className="text-left">
            <p className="text-[13px] font-semibold text-gray-900 capitalize">
              View full journey history
            </p>
            <p className="text-[10px] font-medium text-gray-400 tracking-wide">
              Detailed timestamps for every milestone
            </p>
          </div>
        </div>

        <div className="text-gray-400 group-hover:text-gray-700 transition-colors">
          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </button>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <RideTimelineStatus timeline={timeline} />
        </div>
      )}
    </div>
  );
};

export default RideTimelineExpandable;
