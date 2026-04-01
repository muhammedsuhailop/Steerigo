import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamationCircle,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useSubmitRideRatingMutation } from "../services/viewRideApi";
import { ApiErrorResponse } from "@/shared/api/types/errors";
import { StarRating } from "@/shared/components/ui/Star/Star";
import { RatingDetails } from "../types/viewRide.types";
import { useDispatch } from "react-redux";
import { updateRideRatingLocal } from "../store/viewRideSlice";

interface RideRatingProps {
  rideId: string;
  existingRating?: RatingDetails;
}

const RideRating: React.FC<RideRatingProps> = ({ rideId, existingRating }) => {
  const dispatch = useDispatch();
  const [submitRating, { isLoading }] = useSubmitRideRatingMutation();

  const [step, setStep] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [criteria, setCriteria] = useState<any>({
    Behavior: 0,
    Punctuality: 0,
    Safety: 0,
    Comfort: 0,
    Communication: 0,
  });

  const isReview = step === CRITERIA.length;
  const current = CRITERIA[step];

  const handleNext = () => {
    if (!isReview && criteria[current.key] === 0) {
      setError("Please select a rating");
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const response = await submitRating({
        rideId,
        criteria,
        review,
      }).unwrap();

      dispatch(
        updateRideRatingLocal({
          overallRating: response.data.overallRating,
          review: review,
          reviewType: "User Revie",
          createdAt: new Date().toISOString(),
          driverStats: {
            averageRating: response.data.driver.averageRating,
            numberOfRatings: response.data.driver.numberOfRatings,
          },
        }),
      );
    } catch (err) {
      const apiErr = err as { data?: ApiErrorResponse };
      setError(apiErr.data?.error?.userMessage || "Failed to submit");
    }
  };

  if (existingRating) {
    return (
      <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-[1px] shadow-sm">
        <div className="w-full md:w-1/3">
          <h2 className="text-lg font-bold text-gray-900">Ride Feedback</h2>
        </div>

        <div className="flex-1 w-full flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= existingRating.overallRating ? (
                <FaStar key={star} className="text-amber-400" />
              ) : (
                <FaRegStar key={star} className="text-gray-300" />
              ),
            )}
          </div>

          <p className="text-sm font-medium text-gray-700">
            {getRatingLabel(existingRating.overallRating)} •{" "}
            {existingRating.overallRating}/5
          </p>

          {existingRating.review && (
            <p className="text-sm text-gray-600 italic max-w-md">
              "{existingRating.review}"
            </p>
          )}

          <div className="text-xs text-gray-400 space-y-1">
            <p>{new Date(existingRating.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-[1px] shadow-sm">
      <div className="flex flex-col justify-between h-full w-full md:w-1/3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Rate your ride</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your feedback helps improve experience
          </p>
        </div>

        <div className="mt-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${(step / CRITERIA.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Step {Math.min(step + 1, CRITERIA.length + 1)} of{" "}
            {CRITERIA.length + 1}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center text-center space-y-6">
        {!isReview ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900">
              {current.question}
            </h3>

            <StarRating
              value={criteria[current.key]}
              onChange={(val) =>
                setCriteria((prev: any) => ({
                  ...prev,
                  [current.key]: val,
                }))
              }
            />

            {criteria[current.key] > 0 && (
              <p className="text-sm font-medium text-gray-600">
                {getRatingLabel(criteria[current.key])} •{" "}
                {criteria[current.key]}/5
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900">
              Add a review
            </h3>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-black resize-none min-h-[120px]"
            />
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <FaExclamationCircle />
            {error}
          </div>
        )}

        <div className="flex justify-between w-full pt-2">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="text-gray-600 flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          ) : (
            <div />
          )}

          {!isReview ? (
            <button
              onClick={handleNext}
              className="bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideRating;

const CRITERIA = [
  { key: "Behavior", question: "Driver behavior" },
  { key: "Punctuality", question: "Arrival on time" },
  { key: "Safety", question: "Safety during ride" },
  { key: "Comfort", question: "Ride comfort" },
  { key: "Communication", question: "Communication quality" },
] as const;

const getRatingLabel = (value: number) => {
  if (value <= 1) return "Poor";
  if (value <= 2) return "Fair";
  if (value <= 3) return "Good";
  if (value <= 4) return "Very Good";
  return "Excellent";
};
