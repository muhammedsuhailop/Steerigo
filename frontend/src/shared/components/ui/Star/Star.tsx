import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export const StarRating = ({ value, onChange, size = 36 }: StarRatingProps) => {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = value >= star;
        const isHalf = value >= star - 0.5 && value < star;

        return (
          <div key={star} className="relative cursor-pointer group">
            {/* Left half */}
            <div
              onClick={() => onChange(star - 0.5)}
              className="absolute left-0 top-0 w-1/2 h-full z-10"
            />

            {/* Right half */}
            <div
              onClick={() => onChange(star)}
              className="absolute right-0 top-0 w-1/2 h-full z-10"
            />

            {/* Icon */}
            {isFull ? (
              <FaStar size={size} className="text-amber-400 drop-shadow-sm" />
            ) : isHalf ? (
              <FaStarHalfAlt size={size} className="text-amber-400" />
            ) : (
              <FaRegStar
                size={size}
                className="text-gray-300 group-hover:text-gray-400"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
