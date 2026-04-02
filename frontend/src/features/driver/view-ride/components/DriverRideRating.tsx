import React from "react";
import {
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoChatbubbleEllipses,
} from "react-icons/io5";
import { RatingDetails } from "../types/viewDriverRide.types";

interface DriverRideRatingProps {
  rating: RatingDetails | undefined;
}

const DriverRideRating: React.FC<DriverRideRatingProps> = ({ rating }) => {
  if (!rating) return null;

  const theme = getRatingTheme(rating.overallRating);

  const renderStars = (value: number, size = 18) => {
    return (
      <div className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => {
          if (value >= i)
            return <IoStar key={i} size={size} className="text-yellow-400" />;
          if (value >= i - 0.5)
            return (
              <IoStarHalf key={i} size={size} className="text-yellow-400" />
            );
          return (
            <IoStarOutline key={i} size={size} className="text-gray-300" />
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="text-4xl font-extrabold text-gray-900">
          {rating.overallRating}
        </div>

        {renderStars(rating.overallRating)}

        <span className={`text-sm font-semibold ${theme.color}`}>
          {theme.label}
        </span>
      </div>

      <div className="my-5 h-[1px] bg-gray-100" />

      {rating.criteria && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.entries(rating.criteria).map(([key, value]) => (
            <div
              key={key}
              className="min-w-[120px] flex-shrink-0 bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2"
            >
              <p className="text-[11px] text-gray-400 capitalize mb-1">{key}</p>

              <div className="flex items-center justify-between">
                {renderStars(value, 12)}
                <span className="text-xs font-semibold text-gray-500">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rating.review && (
        <div className="relative mt-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5">
          <IoChatbubbleEllipses
            size={20}
            className="absolute top-4 right-4 text-gray-200"
          />

          <p className="text-sm text-gray-700 italic leading-relaxed pr-6">
            “{rating.review}”
          </p>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <span className="font-medium">
              {rating.reviewerName || "Anonymous"}
            </span>
            <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRideRating;

const getRatingTheme = (rating: number) => {
  if (rating >= 4.5) return { label: "Excellent", color: "text-emerald-600" };
  if (rating >= 4.0) return { label: "Very Good", color: "text-blue-600" };
  if (rating >= 3.0) return { label: "Good", color: "text-yellow-600" };
  if (rating >= 2.0) return { label: "Average", color: "text-orange-600" };
  return { label: "Bad", color: "text-red-600" };
};
