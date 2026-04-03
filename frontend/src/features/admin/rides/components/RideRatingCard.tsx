import React from "react";
import {
  MdStar,
  MdRateReview,
  MdOutlineChatBubbleOutline,
} from "react-icons/md";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import { RatingDetails } from "../types/ride-details.types";

export const RideRatingCard: React.FC<{ rating?: RatingDetails }> = ({
  rating,
}) => {
  if (!rating) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MdRateReview className="text-yellow-500 text-xl" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
            Review & Rating
          </h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {rating.reviewType}
        </span>
      </div>

      <div className="space-y-6">
        {/* Overall Score Header */}
        <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div>
            <p className="text-[10px] font-black text-yellow-700 uppercase tracking-tighter">
              Overall Score
            </p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-yellow-800">
                {rating.overallRating}
              </span>
              <MdStar className="text-yellow-500 text-xl" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              By {rating.reviewerName}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              {Formatters.formatDate(rating.createdAt, { includeTime: true })}
            </p>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(rating.criteria).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-gray-500">{key}</span>
                <span className="text-gray-900">{value}/5</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Written Review */}
        {rating.review && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 relative">
            <MdOutlineChatBubbleOutline
              className="absolute -top-2 -left-2 text-gray-300 bg-white rounded-full p-0.5"
              size={20}
            />
            <p className="text-sm italic text-gray-700 leading-relaxed">
              "{rating.review}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
